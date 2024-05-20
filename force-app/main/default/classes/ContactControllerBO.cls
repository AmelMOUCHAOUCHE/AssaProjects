public with sharing class ContactControllerBO {
    @AuraEnabled
    public static void createContactBo(String civilite, String firstName, String lastName, String email, Id accountId){
        try {
            // Créer un nouveau contact avec les informations fournies
            Contact newContact = new Contact(
                FirstName = firstName,
                LastName = lastName,
                Email = email,
                AccountId = accountId,  
                InwiB2C_Civilit__c = civilite
            );

            // Insérer le contact dans Salesforce    
            insert newContact;

            // Retourner l'ID du contact
            return newContact.Id;
                        
        } catch (Exception e) {
            // Retourner un message d'erreur en cas d'échec
            throw new AuraHandledException('Erreur lors de la création du contact : ' + e.getMessage());
        }
    }


   /* @AuraEnabled
    public static string createUserBO(){
        try {
            //creer un user 
            User newUser = new User(
                Username = username,
                FirstName = firstName,
                LastName = lastName,
                Email = email,
                Alias = 'Default', // Exemple de valeur pour le champ Alias
                TimeZoneSidKey = 'America/New_York', // Exemple de valeur pour le champ Time Zone
                LocaleSidKey = 'en_US', // Exemple de valeur pour le champ Locale
                EmailEncodingKey = 'UTF-8', // Exemple de valeur pour le champ Email Encoding
                ProfileId = userProfileId, // Utiliser l'ID du profil récupéré
                LanguageLocaleKey = 'en_US' // Exemple de valeur pour le champ Language
                //contactId = ContactId ;         
                );

             insert newUser;

            
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
*/
    
}