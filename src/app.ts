import MyScene from './my-scene'
window.addEventListener('DOMContentLoaded', () => {
    // Create the game using the 'renderCanvas'.
    let game = new MyScene('renderCanvas');

    // Create the scene.
    game.createScene();

    game.update()

    // Start render loop.
    game.doRender();
  });