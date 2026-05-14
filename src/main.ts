import './styles/style.scss';

init();

function init() {
    const startScreen = document.getElementById('start-screen');
    const homeScreen = document.getElementById('home-screen');

    if (startScreen && homeScreen) {
        startScreen.addEventListener('click', event => {
            const button = (event.target as HTMLElement).closest('.start-screen__play-button') as HTMLButtonElement;
            if (button) {
                startScreen.classList.toggle('d_none');
                homeScreen.classList.toggle('d_none');
            }
        })
    }
}





// const button = (event.target as HTMLElement).closest('.card')