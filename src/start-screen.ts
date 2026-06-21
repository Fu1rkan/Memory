import { getClosestElement } from './dom';
import { showScreen } from './screen-navigation';

export function setupStartScreen(startScreen: HTMLElement, homeScreen: HTMLElement) {
    startScreen.addEventListener('click', event => {
        const playButton = getClosestElement(event, '.start-screen__play-button');

        if (playButton) {
            showScreen(homeScreen, startScreen);
        }
    });
}
