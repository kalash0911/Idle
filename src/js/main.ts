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

// Menu navigation

const slugify = (text: string) =>
    text.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

const menuNavLists = document.querySelectorAll<HTMLUListElement>('[data-menu-nav]');

menuNavLists.forEach((list) => {
    const category = list.dataset.menuNav;
    const block = category && document.getElementById(category);

    if (!block) return;

    const items = block.querySelectorAll<HTMLElement>('.menu-section__block-item');

    items.forEach((item, index) => {
        const title = item.querySelector('.menu-section__title')?.textContent?.trim();

        if (!title) return;

        if (!item.id) {
            item.id = `${category}-${slugify(title) || index}`;
        }

        const li = document.createElement('li');
        li.className = 'menu-section__nav-list-item';

        const link = document.createElement('a');
        link.className = 'menu-section__nav-list-link';
        link.href = `#${item.id}`;
        link.textContent = title;

        li.append(link);
        list.append(li);
    });
});

const menuNav = document.querySelector<HTMLElement>('.menu-section__nav');
const menuLinks = document.querySelectorAll<HTMLAnchorElement>('.menu-section__nav-list-link');
const menuActiveClass = 'menu-section__nav-list-link--active';
const menuActiveOffset = 200;

let activeMenuLink: HTMLAnchorElement | null = null;
// while the page scrolls after a nav click, the scroll spy is paused
let isMenuClickScroll = false;
let menuScrollEndTimer: number | undefined;

const activateMenuLink = (link: HTMLAnchorElement | null) => {
    if (link === activeMenuLink) return;

    activeMenuLink?.classList.remove(menuActiveClass);
    link?.classList.add(menuActiveClass);
    activeMenuLink = link;

    // keep the active link visible in the horizontally scrolling nav
    if (link && menuNav && menuNav.scrollWidth > menuNav.clientWidth) {
        const navRect = menuNav.getBoundingClientRect();
        const linkRect = link.getBoundingClientRect();

        menuNav.scrollTo({
            left: menuNav.scrollLeft + linkRect.left - navRect.left - (navRect.width - linkRect.width) / 2,
            behavior: 'smooth',
        });
    }
};

const setActiveMenuLink = () => {
    let current: HTMLAnchorElement | null = null;

    for (const link of menuLinks) {
        const target = document.getElementById(link.hash.slice(1));

        if (target && target.getBoundingClientRect().top <= menuActiveOffset) {
            current = link;
        }
    }

    activateMenuLink(current ?? menuLinks[0] ?? null);
};

const onMenuScroll = () => {
    if (!isMenuClickScroll) {
        setActiveMenuLink();
        return;
    }

    // treat the click scroll as finished once scroll events stop coming
    clearTimeout(menuScrollEndTimer);
    menuScrollEndTimer = window.setTimeout(() => {
        isMenuClickScroll = false;
    }, 150);
};

if (menuLinks.length) {
    menuLinks.forEach((link) => {
        link.addEventListener('click', () => {
            isMenuClickScroll = true;
            activateMenuLink(link);

            // release the lock even if the page is already in place and doesn't scroll
            clearTimeout(menuScrollEndTimer);
            menuScrollEndTimer = window.setTimeout(() => {
                isMenuClickScroll = false;
            }, 150);
        });
    });

    setActiveMenuLink();
    window.addEventListener('scroll', onMenuScroll, { passive: true });
    window.addEventListener('resize', setActiveMenuLink);
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