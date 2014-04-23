/*

casperjs indexator.js --email="yourgmailaccount@gmail.com" --password="yourpassword" --2steps="123123" --indexor="http://www.yourcontrolledwebsite.com" --url="301.php?url=http://www.websitetoindex.com"

*/

var casper = require("casper").create({
    viewportSize: {
        width: 1600,
        height: 1200
    }
});
var x = require('casper').selectXPath;

casper.userAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/34.0.1847.116 Safari/537.36');
casper.start('https://www.google.com/webmasters/tools/googlebot-fetch?hl=fr&siteUrl='+casper.cli.raw.get('indexor'));
casper.then(function() {
    this.evaluate(function(){
        var style = document.createElement('style'),
        text = document.createTextNode('body { background: #fff }');
          style.setAttribute('type', 'text/css');
          style.appendChild(text);
          document.head.insertBefore(style, document.head.firstChild);
    });
});

// remplissage du form de login
casper.then(function() {
    this.echo('Login...');
    this.fill('#gaia_loginform', {
        'Email':  casper.cli.raw.get('email'),
        'Passwd':  casper.cli.raw.get('password')
    }, true);
});

// validation 2 étapes
casper.then(function() {
    this.echo('2 steps validation...');
    this.fill('#gaia_secondfactorform', {
        'smsUserPin':          casper.cli.raw.get('2steps'),
        'PersistentCookie':       true
    }, true);
});

// insertion url
casper.then(function() {
    this.echo('Ajout url');
    this.fill('#googlebot-request-fetch-form', {
        'path':          casper.cli.raw.get('url')
    }, true);
});

// attente de "envoyer pour indexation"
casper.waitForSelector(x("//div[text()='Envoyer pour indexation']"), function() {
    this.echo('Envoi pour indexation de l\'URL + liens directs...');
    this.click(x("//div[text()='Envoyer pour indexation']"));
}, function timeout() { this.echo('/!\\Bouton "Envoi pour indexation" non trouvé.'); });

// attente de "N'envoyer que l'URL pour indexation"
casper.waitForSelector(x("//a[text()=\"N'envoyer que l'URL pour indexation\"]"), function() {
    this.echo('Envoi pour indexation de l\'URL seule...');
    this.click(x("//a[text()=\"N'envoyer que l'URL pour indexation\"]"));
}, function timeout() { this.echo('/!\\Lien "N\'envoyer que l\'URL pour indexation" non trouvé.'); });

// attente de "Explorer cette URL et les liens directs"
casper.waitForSelector(x("//input[@class='submit-dialog-radio' and @value='crawl-site' and @type='radio']"), function() {
    this.echo('Clic sur Explorer cette URL et les liens direct...');
    this.click(x("//input[@class='submit-dialog-radio' and @value='crawl-site' and @type='radio']"));
}, function timeout() { this.echo('Bouton "Explorer cette URL et les liens directs" non trouvé...'); });

// clic sur bouton OK
casper.waitForSelector(x("//button[@name='ok']"), function() {
    this.echo('Clic sur OK');
    this.click(x("//button[@name='ok']"));
}, function timeout() { this.echo('Bouton "OK" non trouvé...'); });

// clic sur bouton OK
casper.waitForSelector(x("//span[text()='Nous avons bien reçu votre demande et procéderons à son traitement sous peu.']"), function() {
    this.echo('Confirmation reçue, url envoyée pour indexation.');
}, function timeout() { this.echo('Confirmation non reçue, url non envoyée pour indexation'); });

casper.then(function() {
    this.capture('picture.jpg', {
        top: 0,
        left: 0,
        width: 1600,
        height: 1200
    },
    {
        format: 'jpg',
        quality: 100
    });
});

casper.run(function() {
    this.exit();
});
