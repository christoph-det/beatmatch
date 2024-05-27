export function BackgroundView(props) {

    function renderLine() {
        let e = document.createElement('div');
        e.setAttribute('class', 'circle');
        document.body.appendChild(e);

        e.style.width = 2 + Math.random() * 12; + 'px';
        e.style.left = Math.random() * + (innerWidth - 30) + 'px';

        // Adjust to change speed and duration of circles
        e.style.animationDuration = 5 + Math.random() * 5 + 's';

        // Random colors
        const royalBlue = getComputedStyle(document.documentElement).getPropertyValue('--royal-blue');
        const neonGreen = getComputedStyle(document.documentElement).getPropertyValue('--neon-green');
        const shrekGreen = getComputedStyle(document.documentElement).getPropertyValue('--shrek-green');
        const skyBlue = getComputedStyle(document.documentElement).getPropertyValue('--sky-blue');

        const circleColors = [
            royalBlue,
            neonGreen,
            shrekGreen,
            skyBlue,
        ]

        const randomColor = circleColors[Math.floor(Math.random() * circleColors.length)];
        e.style.setProperty('--circle-color', randomColor);

        function removeElementCB() {
            document.body.removeChild(e);
        }
        setTimeout(removeElementCB, 10000);
    }

    function renderInterval() {
        function renderLinesCB() {
            renderLine();
        }
        setInterval(renderLinesCB, 1000);
    }

    return (
        renderInterval()
    );
}
  