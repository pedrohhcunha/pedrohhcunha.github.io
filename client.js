import { io } from 'https://cdn.socket.io/4.4.1/socket.io.esm.min.js';

/**
 * Create a function to return the Viewport size.
 */
function getViewportSize() {
    const width = Math.max(
      document.documentElement.clientWidth || 0,
      window.innerWidth || 0,
    );

    const height = Math.max(
      document.documentElement.clientHeight || 0,
      window.innerHeight || 0,
    );

    return {
        width,
        height
    };
}

/**
 * Create a function to return the device type.
 * 'Desktop' | 'Tablet' | 'Mobile'
 * Based on the user agent.
 */
function getDeviceType() {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;

    if (/android/i.test(userAgent)) {
        return 'Mobile';
    }

    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
        return 'Tablet';
    }

    return 'Desktop';
}

/**
 * Create a function to return the browser
 * Like 'Chrome' | 'Firefox' | 'Safari' | 'IE' | 'Edge' | 'Opera' | ...
 */
function getBrowser() {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;

    if (/edge/i.test(userAgent)) {
        return 'edge';
    }

    if (/opr/i.test(userAgent)) {
        return 'opera';
    }

    if (/chrome/i.test(userAgent)) {
        return 'chrome';
    }

    if (/firefox/i.test(userAgent)) {
        return 'firefox';
    }

    if (/safari/i.test(userAgent)) {
        return 'safari';
    }

    return undefined;
}

/**
 * Create a function to return the Operating System
 * Like 'Windows' | 'MacOS' | 'Linux' | 'Android' | 'iOS' | ...
 */
function getOperatingSystem() {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;

    if (/windows/i.test(userAgent)) {
        return 'windows';
    }

    if (/mac/i.test(userAgent)) {
        return 'macos';
    }

    if (/linux/i.test(userAgent)) {
        return 'linux';
    }

    if (/android/i.test(userAgent)) {
        return 'android';
    }

    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
        return 'ios';
    }

    return undefined;
}

/**
 * Create a function to return the browser language
 */
function getBrowserLanguage() {
    return navigator.language || navigator.userLanguage;
}

/**
 * Create a function to return the UTM parameters
 * Like 'utm_source' | 'utm_medium' | 'utm_campaign' | 'utm_term' | 'utm_content'
 */

function getUTMParameters() {
    const utmParameters = {};

    const urlParams = new URLSearchParams(window.location.search);

    const utmSource = urlParams.get('utm_source');
    const utmMedium = urlParams.get('utm_medium');
    const utmCampaign = urlParams.get('utm_campaign');
    const utmTerm = urlParams.get('utm_term');
    const utmContent = urlParams.get('utm_content');

    if (utmSource) {
        utmParameters.source = utmSource;
    }

    if (utmMedium) {
        utmParameters.medium = utmMedium;
    }

    if (utmCampaign) {
        utmParameters.campaign = utmCampaign;
    }

    if (utmTerm) {
        utmParameters.content = utmTerm;
    }

    if (utmContent) {
        utmParameters.term = utmContent;
    }

    return Object.keys(utmParameters).length >= 1
      ? utmParameters
      : undefined;
}

/**
 * Create a function to return landing page
 */
function getLandingPage() {
    return window.location.pathname;
}

/**
 * Create a function to return the website domain
 */
function getWebsiteDomain() {
    return window.location.hostname;
}

/**
 * Create a function to return the origin page
 * From where the user came from
 */
function getOriginPage() {
    return document.referrer;
}

/**
 * Create a function to return the use location
 * Based on the user IP address
 * Like { country: 'Romania', city: 'Bucharest', latitude: 44.43225, longitude: 26.10626 }
 * It uses the ip-api.com API
 */
async function getUserLocationAndIpAddress() {
    const API_URL = 'http://ip-api.com/json?fields=status,country,city,lat,lon,query';

    const response = await fetch(API_URL);

    const data = await response.json();

    if (data.status === 'success') {
        return {
            ipAddress: data.query,
            location: {
                country: data.country,
                city: data.city,
                latitude: data.lat,
                longitude: data.lon,
            },
        };
    }

    return undefined;
}

/**
 *  * Create a function to return the browser id
 *  * It is stored in the localStorage
 *  * If it does not exist, return undefined
 *  * If it exists, return the browser id
 *  */
function getBrowserId() {
    return localStorage.getItem('browserId');
}

/**
 * Create a function to return the session
 */
async function getSession() {
    return {
        browserId: getBrowserId(),
        deviceType: getDeviceType(),
        utmParameters: getUTMParameters(),
        operationSystem: getOperatingSystem(),
        browser: getBrowser(),
        viewport: getViewportSize(),
        language: getBrowserLanguage(),
        landingPage: getLandingPage(),
        originPage: getOriginPage(),
        domain: getWebsiteDomain(),
        ...await getUserLocationAndIpAddress(),
    };
}

/**
 * Create a function to save the browser id
 * It is stored in the localStorage
 * It is used to save the browser id received from the server
 * @param {string} browserId
 * The browser id received from the server
 */
function saveBrowserId(browserId) {
    localStorage.setItem('browserId', browserId);
}

/**
 * Create a function to current scroll position
 * Like { x: 0, y: 0 }
 */
function getScrollPosition() {
    return {
        x: window.scrollX,
        y: window.scrollY,
    };
}

/**
 * Create a function to encrypt the input text value to send from the client to the server
 * Replace each character per *
 */
function encryptInputTextValue(text) {
    return text.replace(/./g, '*');
}

/**
 * Create a function to identify the element based on click event
 * Like { path: 'body.class#id>div.class', target: 'input.class#id', dataTracker: 'my-button' }
 * dataTracker is a custom attribute - data-tracker
 * path is the path from the body to the target element
 * target is the target element
 */
function identifyElement(event) {
    const targetTag = event.target.tagName?.toLowerCase();
    const targetId = event.target.id
      ? `#${event.target.id}`
      : '';
    const targetClass = event.target.className
      ? `.${event.target.className}`
      : '';

    const target = `${targetTag}${targetClass}${targetId}`;

    const path = event.composedPath()
      .filter(element => element.tagName)
      .map(element => {
          const tag = element.tagName.toLowerCase();
          const id = element.id
            ? `#${element.id}`
            : '';
          const className = element.className
            ? `.${element.className}`
            : '';

          return `${tag}${className}${id}`;
      })
      .slice(1)
      .reverse()
      .join('>')

    const dataTracker = event.target.getAttribute('data-tracker');

    return {
        path,
        target,
        dataTracker,
    }
}

/**
 * This function is called when the page is loaded.
 * It connects to the server using the WebSocket protocol.
 * It sends the session to the server.
 * It listens to the server to receive the browser id.
 * Is listen to browser events to send them to the server.
 * It sends browser events to the server, each 2 seconds.
 */
function init() {
    const socket = io('https://web-tracker.herokuapp.com');

    socket.on('connect', async () => {

        const session = await getSession();

        socket.emit('start-session', session);

        socket.on('session-created', session => saveBrowserId(session.browserId));

        const events = [];

        const sendEvents = () => {
            if (events.length) {
                socket.emit('events', events);
                events.length = 0;
            }
        }

        setInterval(sendEvents, 1000);

        // Detect viewport resize event
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);

            scrollTimeout = setTimeout(() => {
                events.push({
                    type: 'viewport-resize',
                    createdAt: new Date(),
                    viewportResize: getViewportSize(),
                });
            }, 500);
        });

        // Detect scroll event
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                events.push({
                    type: 'scroll',
                    createdAt: new Date(),
                    scroll: getScrollPosition(),
                });
            }, 500);
        });

        // Detect click event
        window.addEventListener('click', event => {
            events.push({
                type: 'click',
                createdAt: new Date(),
                click: {
                    x: event.clientX,
                    y: event.clientY,
                    ...identifyElement(event),
                },
            });
        });

        // Detect double click event
        window.addEventListener('dblclick', event => {
            events.push({
                type: 'double-click',
                createdAt: new Date(),
                doubleClick: {
                    x: event.clientX,
                    y: event.clientY,
                    ...identifyElement(event),
                },
            });
        });

        // Detect right click event
        window.addEventListener('contextmenu', event => {
            events.push({
                type: 'right-click',
                createdAt: new Date(),
                rightClick: {
                    x: event.clientX,
                    y: event.clientY,
                    ...identifyElement(event),
                },
            });
        });

        // Detect input change event
        // We listen for all input type text elements
        // When user start typing and then stop typing, we send the input value to the server
        // stop typing is detected after 2 seconds of inactivity or focus out
        // encrypted input value before sending it to the server
        const inputElements = document.querySelectorAll('input[type="text"]');

        inputElements.forEach(inputElement => {
            let timeout;

            const sendInputValue = () => {

                events.push({
                    type: 'input-change',
                    createdAt: new Date(),
                    inputChange: {
                        id: inputElement.id,
                        name: inputElement.name,
                        type: inputElement.type,
                        value: encryptInputTextValue(inputElement.value),
                        ...identifyElement(event),
                    },
                });
            }

            inputElement.addEventListener('input', () => {
                clearTimeout(timeout);
                timeout = setTimeout(sendInputValue, 500);
            });
        });
    });
}

// On page complete load, get session and send it to the server
window.addEventListener('load', init);