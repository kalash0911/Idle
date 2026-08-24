// Header

const header = document.querySelector('.header');

let lastScrollY = window.scrollY;

const toggleHeaderScroll = () => {
    const currentScrollY = window.scrollY;

    header?.classList.toggle('header--scroll', currentScrollY > 0);
    header?.classList.toggle('header--scroll-down', currentScrollY > lastScrollY && currentScrollY > 0);

    lastScrollY = currentScrollY;
};

toggleHeaderScroll();
window.addEventListener('scroll', toggleHeaderScroll);

const burger = document.querySelector('.burger');
const linkClose = document.querySelectorAll('.link--close');
const overlay = document.querySelector('.overlay');

burger?.addEventListener('click', function () {
    document.body.classList.toggle('body--lock');
    document.body.classList.toggle('active');
});

overlay?.addEventListener('click', function () {
    document.body.classList.toggle('body--lock');
    document.body.classList.toggle('active');
});

for (let i = 0; i < linkClose.length; ++i) {
    linkClose[i].addEventListener('click', function () {
        document.body.classList.remove('body--lock');
        document.body.classList.remove('active');
    });
}

// for Swipers

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
function destroySlidersOnResize(selector, width, obj, moreThan) {
    const init = {
        ...obj,
    };

    const win = window;
    const sliderSelector = document.querySelector(selector);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    let swiper = new Swiper(selector, init);

    const toggleInit = () => {
        const neededWidth = moreThan
            ? win.innerWidth >= width
            : win.innerWidth <= width;
        if (neededWidth) {
            if (!sliderSelector?.classList.contains("swiper-initialized")) {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                swiper = new Swiper(selector, init);
            }
        } else if (sliderSelector.classList.contains("swiper-initialized")) {
            swiper.destroy();
        }
    };

    ["load", "resize"].forEach((evt) =>
        win.addEventListener(evt, toggleInit, false)
    );
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
destroySlidersOnResize(".mainSlider", 99999, {
    slidesPerView: 1,
    loop: true,
    effect: 'fade',
    speed: 2000,
    autoplay: {
        delay: 2000,
        disableOnInteraction: false,
    },
});