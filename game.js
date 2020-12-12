var game;
var plataformas;
var jogador;
var cursores;
var estrelas;
var pontos= 0;
var placar;
var logo;
var bombas;
var gameOver= false;
var fim;

function preload() {
    this.load.image('fundo', 'assets/fundo.png');
    this.load.image('plataforma', 'assets/plataforma.png');
    this.load.image('estrela', 'assets/estrela.png');
    this.load.image('bomba', 'assets/bomba.png');
    this.load.spritesheet('Eskimo', 
        'assets/Eskimo.png',{
        frameWidth: 32,
        frameHeight: 32,
    });
};

function create() {
    //Fundo
    this.add.image(400, 300, 'fundo');

    //Plataformas
    plataformas= this .physics.add.staticGroup();
    plataformas.create(420, 170, 'plataforma').refreshBody();
    plataformas.create(100, 310, 'plataforma');
    plataformas.create(420, 450, 'plataforma');
    plataformas.create(700, 310, 'plataforma');
    plataformas.create(100, 584, 'plataforma');
    plataformas.create(300, 584, 'plataforma');
    plataformas.create(500, 584, 'plataforma');
    plataformas.create(700, 584, 'plataforma');

    //Jogador
    jogador= this.physics.add.sprite(420, 390, 'Eskimo');
    jogador.setBounce(0.2);
    jogador.setCollideWorldBounds(true);

    this.anims.create({
        key: 'mover_para_esquerda',
        frames: this.anims.generateFrameNumbers(
            'Eskimo', {
                start: 0,
                end: 3,
            },
        ),
        frameRate: 10,
        repeat: -1,
    });

    this.anims.create({
        key: 'mover_para_direita',
        frames: this.anims.generateFrameNumbers(
            'Eskimo', {
                start: 5,
                end: 8,
            },
        ),
        frameRate: 10,
        repeat: -1,
    });

    this.anims.create({
        key: 'ficar_parado',
        frames: [ { key: 'Eskimo', frame: 4 } ],
        frameRate: 20,
    });

    this.physics.add.collider(jogador, plataformas);

    //Teclado
    cursores= this.input.keyboard.createCursorKeys();

    //Estrelas
    estrelas= this.physics.add.group({
        key: 'estrela',
        repeat: 7,
        setXY: {x: 50, y: 0, stepX: 100}
    });

    estrelas.children.iterate((estrela)=> {
        estrela.setBounceY(Phaser.Math.FloatBetween(0.2, 0.5));
    });

    this.physics.add.collider(estrelas, plataformas);

    this.physics.add.overlap(jogador, estrelas, pegarEstrela, null, this);

    //Placar
    placar= this.add.text(650, 16, 'pontos= 0', {fontSize: '18px', fill: '#ffffff',});

    //Logo
    logo= this.add.text(20, 16, '❄Eskimo | Matheus Khairallah❄', {fontSize: '24px', fill: '#BADAA0',});

    //Bombas
    bombas= this.physics.add.group();
    this.physics.add.collider(bombas, plataformas);
    this.physics.add.collider(jogador, bombas, congelado, null, this);

    //Fim
    fim= this.add.text(200, 325, '', {fontSize: '72px', fill: '#ffffff',});
};

function update() {
    if (cursores.left.isDown) {
        jogador.setVelocityX(-160);
        jogador.anims.play('mover_para_esquerda', true);
    } else if (cursores.right.isDown) {
        jogador.setVelocityX(160);
        jogador.anims.play('mover_para_direita', true);
    } else {
        jogador.setVelocityX(0);
        jogador.anims.play('ficar_parado');
    }

    if (cursores.up.isDown && jogador.body.touching.down) {
        jogador.setVelocityY(-302);
    }
};

function pegarEstrela(jogador, estrela) {
    estrela.disableBody(true, true);

    pontos += 5;
    placar.setText(`pontos= ${pontos}`);

    if (estrelas.countActive(true) == 0) {
        estrelas.children.iterate((estrela)=> {
            estrela.enableBody(true, estrela.x, 0, true, true);
        });

        var x;
        if (jogador.x <400) {
            x= Phaser.Math.Between(400, 800);
        } else {
            x= Phaser.Math.Between(0, 400);
        }
    
        var bomba= bombas.create(x, 0, 'bomba');
        bomba.setBounce(1);
        bomba.setCollideWorldBounds(true);
        bomba.setVelocity(Phaser.Math.Between(-200, 200), 20);
    }


}

function congelado(jogador, bombas) {
    this.physics.pause();
    jogador.setTint(0x19A29B);
    jogador.anims.play('ficar_parado');
    gameOver= true;
    fim.setText('Congelado!');
}

game= new Phaser.Game({
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {y: 300},
            debug: false,
        },
    },
    scene: {
        preload,
        create,
        update,
    },
});