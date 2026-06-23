import type { GameTheme } from './game-themes';

const cardImageFolder = `${import.meta.env.BASE_URL}img/cards`;

const codeVibesImages = [
    'angular.png',
    'bootstrap.png',
    'css.png',
    'django.png',
    'firebase.png',
    'git.png',
    'github.png',
    'html.png',
    'javascript.png',
    'nodejs.png',
    'python.png',
    'react.png',
    'sass.png',
    'sql.png',
    'terminal.png',
    'typescript.png',
    'vscode.png',
    'vue.png',
];

const gamingImages = [
    'ace_of_diamonds.png',
    'banana.png',
    'dice.png',
    'game_controller.png',
    'handheld_console.png',
    'level_up_badge.png',
    'maze.png',
    'minecraft_creeper.png',
    'pacman.png',
    'pacman_and_ghost.png',
    'play_button.png',
    'puzzle_pieces.png',
    'snake_game.png',
    'squid_game_circle_guard.png',
    'squid_game_square_guard.png',
    'squid_game_triangle_guard.png',
    'star_coin.png',
];

const daProjectImages = [
    'bestell_app.png',
    'code-a-cuisine.png',
    'coderr.png',
    'coins.png',
    'el_pollo_loco.png',
    'join.png',
    'kanmind.png',
    'kochwelt.png',
    'pokedex.png',
    'poll_app.png',
    'profile.png',
    'sakura_ramen.png',
    'sakura_ramen_eggs.png',
    'sakura_ramen_ramen.png',
    'sakura_ramen_soup.png',
    'sharki.png',
    'tic_tac_toe.png',
    'videoflix.png',
];

const foodImages = [
    'bretzel.png',
    'burger.png',
    'chocolate_bar.png',
    'chocolate_pudding.png',
    'corn_dog.png',
    'cupcake.png',
    'donut.png',
    'flan.png',
    'french_fries.png',
    'fried_chicken.png',
    'ice_cream_cone.png',
    'macarons.png',
    'pizza_slice.png',
    'salad_bowl.png',
    'sandwich.png',
    'sushi_roll.png',
    'taco.png',
    'wrap.png',
];

export const cardImages: Record<GameTheme, string[]> = {
    'code-vibes': createCardImagePaths('code_vibes', codeVibesImages),
    gaming: createCardImagePaths('game_theme', gamingImages),
    'da-projects': createCardImagePaths('da_projects', daProjectImages),
    foods: createCardImagePaths('food_theme', foodImages),
};

function createCardImagePaths(themeFolder: string, fileNames: string[]) {
    return fileNames.map(fileName => `${cardImageFolder}/${themeFolder}/${fileName}`);
}
