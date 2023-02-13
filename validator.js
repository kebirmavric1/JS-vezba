class Validator {
    constructor(config) {
        this.elementsConfig = config;
        this.errors = {};


    this.generateErrorsObject();
    this.inputListener();

    }

    generateErrorsObject() {
        for(let field in this.elementsConfig) {
            this.errors[field] = [];
        }
    }

    inputListener() {   
        let inputSelector = this.elementsConfig;


        for(let field in inputSelector) {
            let  selector = `input[name="${field}"]`
            let el = document.querySelector(selector);
            
            el.addEventListener('input', this.validate.bind(this));
        }
    }

    validate(e) {
        let elFields = this.elementsConfig

        let field = e.target;
        //naziv svih polja za gresku
        let fieldName = field.getAttribute('name');
        // vrednost greski to jest ispisane greske
        let fieldValue = field.value;
        //u ovom postupku [] = niz se odnosi na sva polja
        this.errors[fieldName] = [];
        /*ovo je greska za ime i korisnicko ime u koliko 
        dodje do toga da se u polji nista ne ispise on  izbacuje error*/
        if(elFields[fieldName].required) {
            if(fieldValue === '') {
                this.errors[fieldName].push("Polje je prazno")
            }
        }
        // ovo je greska za email
        if(elFields[fieldName].email) {
            if(!this.validateEmail(fieldValue)) {
                this.errors[fieldName].push('Neispravna email adresa');

            }
        }
         /*u koliko ispis meila bude manji od 5 slova izbacivace gresku
        a u drugom slucaju ukoliko bude veci od  50 slova isto ce izbacivati gresku
        sto znaci da je ispisivanje meila ograniceno od 3 do 50 slova!!!!
        */
        if(fieldValue.length < elFields[fieldName].minlength || fieldValue.length > elFields[fieldName].maxlength) {
            this.errors[fieldName].push(`Polje mora imati ${elFields[fieldName].minlength} i maksimalno ${elFields[fieldName].maxlength} karaktera`);

        }
        if(elFields[fieldName].matching) {
            let matchingEl  = document.querySelector(`input[name="${elFields[fieldName].matching}"]`);
        /*ako je razlicito od elementa sa kojim treba da se 
        poklapa(matching) onda je greska*/
            if(fieldValue !== matchingEl.value) {
                this.errors[fieldName].push('Lozinke se ne poklapaju');
            }
            /*
            da ne bi doslo do greske da se konstantno jedan sa drugim
            uporedjuju mi cemo napraviti petlju if
            */
            if(this.errors[fieldName].length === 0) {
                this.errors[fieldName] = [];
                this.errors[elFields[fieldName].matching] = [];
            }
        }
        /*na kraju treba da ispisemo greske jer smo ovaj  objekat errors 
         popunili greske kad se zavrsi validacija odredjenog polja treba greska da se ispisi
        */
        this.populateErrors(this.errors);
    }

    populateErrors(errors) {
        for(const elem of document.querySelectorAll('ul')) {
            elem.remove()
     }

        for(let key of Object.keys(errors)) {
            let parentElement = document.querySelector(`input[name="${key}"]`).parentElement;
            let errorsElement = document.createElement('ul');
            parentElement.appendChild(errorsElement);

            errors[key].forEach(error => {
                let li = document.createElement('li');
                li.innerText = error;

                errorsElement.appendChild(li);
            });
        }
    }
    validateEmail(email) {
        if(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
            return true;
         }
         return false;
    }

}



