const {google} = require('googleapis');
const mailComposer = require('nodemailer/lib/mail-composer');
	
class CreateMail{

  	constructor(auth, to, sub, body, task, attatchmentSrc){
        this.me = 'mitchell.test.smith@gmail.com';
        this.task = task;
        this.auth = auth;
        this.to = to;
        this.sub = sub;
        this.body = body;
        this.gmail = google.gmail({version: 'v1', auth});
        this.attatchment = attatchmentSrc;
	
	}

	//Creates the mail body and encodes it to base64 format.
	makeBody(){
		var arr = [];
		for(var i=0;i<this.attatchment.length;i++){
			arr[i] = {
				path: this.attatchment[i],
				encoding: 'base64'
			}
		}

		//Mail Body is created.
		if(this.attatchment.length){
			var mail = new mailComposer({
				to: this.to,
				text: this.body,
				subject: this.sub,
				textEncoding: "base64",
				attachments: arr
			});	
		}
		else{

			var mail = new mailComposer({
				to: this.to,
				text: this.body,
				subject: this.sub,
				textEncoding: "base64"
			});
		}
		
		//Compiles and encodes the mail.
		mail.compile().build((err, msg) => {
			if (err){
				return console.log('Error compiling email ' + error);
			} 
		
			const encodedMessage = Buffer.from(msg)
			  .toString('base64')
			  .replace(/\+/g, '-')
			  .replace(/\//g, '_')
			  .replace(/=+$/, '');
			
			if(this.task === 'mail'){
				this.sendMail(encodedMessage);
			}
			else{
				this.saveDraft(encodedMessage);
			}
		});
	}

	//Send the message to specified receiver.
    	sendMail(encodedMessage){
		this.gmail.users.messages.send({
			userId: this.me,
			resource: {
				raw: encodedMessage,
			}
		}, (err, result) => {
			if(err){
				return console.log('NODEMAILER - The API returned an error: ' + err);
			}
				
			console.log("NODEMAILER - Sending email reply from server:", result.data);
		});
    	}

	//Saves the draft.
    	saveDraft(encodedMessage){
		this.gmail.users.drafts.create({
			'userId': this.me,
			'resource': {
			  'message': {
				'raw': encodedMessage
			  }
			}
		})
    	}

	//Deletes the draft.
    	deleteDraft(id){
		this.attachment.gmail.users.drafts.delete({
			id: id,
			userId: this.me 
		});
    	}

	//Lists all drafts.
    	listAllDrafts(){
        	this.gmail.users.drafts.list({
            	userId: this.me
        	}, (err, res) => {
        		if(err){
            			console.log(err);
        		}
			else{
				console.log(res.data);
			}
    		});
    	}
}

module.exports = CreateMail;