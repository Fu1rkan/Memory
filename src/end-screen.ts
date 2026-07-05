import { gameFinishedEventName } from './game-screen';
import { showScreen } from './screen-navigation';

export function setupEndScreen(
    endScreen: HTMLElement,
    gameScreen: HTMLElement,
    homeScreen: HTMLElement,
    startScreen: HTMLElement,
) {
    gameScreen.addEventListener(gameFinishedEventName, () => {
        showScreen(endScreen, startScreen, homeScreen, gameScreen);
    });
}
