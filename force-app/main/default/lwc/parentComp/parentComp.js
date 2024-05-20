import { LightningElement, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import createUser from '@salesforce/apex/UserController.createUser';
import assignPermissionSets from '@salesforce/apex/UserController.assignPermissionSets';
import assignPermissionSetLicenses from '@salesforce/apex/UserController.assignPermissionSetLicenses';
import createContact from '@salesforce/apex/UserController.createContact';
import createContactBo from '@salesforce/apex/ContactControllerBO.createContactBo';

export default class ParentComponent extends LightningElement {
    @track selectedType = '';
    @track distributorId = '';
    @track showHelloWorld = true;
    @track showDistributeur = false;
    @track showSection3 = false;
    @track helloWorldValidated = false;
    @track distributeurValidated = false;
    @track Error = '';
    @track agenceId;
    @track agenceName;
    @track nom = '';
    @track prenom = '';
    @track civilite = '';
    @track email = '';
    @track username = '';
    @track produit = '';

    handleTypeChange(event) {
        this.selectedType = event.detail;
    }

    lookupUpdatehandler(event) {
        this.distributorId = event.detail;
        this.Error = '';
    }

    lookupUpdatehandlerAgence(event) {
        this.agenceId = event.detail;
    }

    handleCancel() {
        this.showForm = false;
    }

    handleSave() {
        this.showForm = false;
        this.showToast('Info', `Selected Type: ${this.selectedType}`, 'info');

        if (this.selectedType === 'Livreur' || this.selectedType === 'Animateur') {
            createUser({
                username: this.username,
                firstName: this.nom,
                lastName: this.prenom,
                email: this.email,
                profileName: 'End User'
            })
            .then(result => {
                this.showToast('Success', 'User created successfully', 'success');
                let userId = result;
                let permSetNames = ['LightningRetailExecutionStarter', 'MapsUser'];

                if (this.selectedType === 'Livreur') {
                    permSetNames.push('ActionPlans');
                }

                return assignPermissionSets({ permSetNames: permSetNames, userId: userId });
            })
            .then(() => {
                this.showToast('Success', 'Permission sets assigned successfully', 'success');
                let permSetLicenseNames = ['SFMaps_Maps_LiveMobileTracking', 'IndustriesVisitPsl', 'SFMaps_Maps_Advanced', 'LightningRetailExecutionStarterPsl'];
                return assignPermissionSetLicenses({ permSetLicenseNames: permSetLicenseNames, userId: userId });
            })
            .then(() => {
                this.showToast('Success', 'Permission set licenses assigned successfully', 'success');
                return createContact({
                    civilite: this.civilite,
                    firstName: this.nom,
                    lastName: this.prenom,
                    email: this.email,
                    userId: userId,
                    accountId: this.agenceId,
                    inwiCGC_UserCGC__c: userId
                });
            })
            .then(() => {
                this.showToast('Success', 'Contact created successfully', 'success');
            })
            .catch(error => {
                this.showToast('Error', 'Error creating user or assigning permissions: ' + (error.body ? error.body.message : error.message), 'error');
            });
        } else {
            createContactBo({
                civilite: this.civilite,
                firstName: this.nom,
                lastName: this.prenom,
                email: this.email,
                AccountId: this.accountId,
            })
            .then(() => {
                this.showToast('Success', 'Contact created successfully', 'success');
            })
            .catch(error => {
                let errorMessage = error.body ? error.body.message : error.message;
                this.showToast('Error', 'Error creating contact: ' + errorMessage, 'error');
            });
        }
    }

    showToast(title, message, variant) {
        const evt = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant,
        });
        this.dispatchEvent(evt);
    }

    handleNomUpdate(event) {
        this.nom = event.detail;
    }

    handlePrenomUpdate(event) {
        this.prenom = event.detail;
    }

    handleCiviliteUpdate(event) {
        this.civilite = event.detail;
    }

    handleEmailUpdate(event) {
        this.email = event.detail;
    }

    handleUsernameUpdate(event) {
        this.username = event.detail;
    }

    handleProduitUpdate(event) {
        this.produit = event.detail;
    }
}
