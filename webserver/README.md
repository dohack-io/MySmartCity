# Webserver for MySmartCity
## Nodes

### GET: /applicationForms/list
Liefert alle verfügbaren Anträge in Kategorien

Returns: [ApplicationFormsOverview](./src/smart_framework/applicationForm/ApplicationFormsOverview.ts)

### GET: /applicationForms/**{categoryId}**/**{formId}**
Liefert alle Felder innerhalb eines Antrages

Returns: [FormField[]](./src/smart_framework/applicationForm/RequestField.d.ts)

### POST: /applicationForms/**{categoryId}**/**{formId}**
Persistiert einen Antrag

Body: *T* key = fieldId, value = Nutzervalue   
Returns: [CreateRequestResponse](./src/smart_framework/applicationForm/CreateRequestResponse.ts)

### POST: /applicationForms/**{categoryId}**/**{formId}**/upload
Persistiert eine Datei zu einem Antrag

Body: Dateiupload (as "file")   
Response: [FileDbObject](./src/smart_framework/applicationForm/FileDbObject.ts)

### GET: /calendar
Liefert Kalendareintäge zurück

Response: [CalendarCategoryItem[]](./src/smart_framework/cityCalendar/CalendarItemResponse.ts)

### GET: /calendar?next=**{number}**
Liefert Kalendereinträge zurück

Response: [CalendarItem[]](./src/smart_framework/cityCalendar/CalendarItem.ts)

### GET: /notifications
Liefert Benachrichtigungen zurück

Response: [Notification[]](./src/smart_framework/notifications/Notification.ts)