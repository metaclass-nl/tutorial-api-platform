import React from 'react';
import './welcome.css';

const Welcome = () => (
    <div className="welcome">
        <header className="welcome__top">
          <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://api-platform.com"
          >
          </a>
          <br/> <br/> <br/> <br/> <br/>
        </header>
        <section className="welcome__main">
            <div className="main__content">
                <h1>
                    <strong>Tutorial API Platform</strong>
                </h1>
                <br/>
                <div className="main__before-starting">
                    <p>
                        This container will host your{' '}
                        <a href={`https://${document.domain}`}><b>React Web App</b></a>.
                    </p>
                    <a
                        target="_blank"
                        rel="noopener noreferrer"
                        href="https://github.com/metaclass-nl/tutorial-api-platform/blob/chapter9-react/README.md"
                        className="main__button"
                    >
                        Get started<Arrow />
                    </a>
                </div>
                <div className="main__other">
                    <h2>Available services:</h2>
                    <div className="other__bloc" style={{"width": "200px", "paddingLeft": "80px"}}>
                        <div className="other__content">
                          <h3><a href={`https://${document.domain}/docs`}>API</a></h3>
                        </div>
                    </div>
                    <div className="other__bloc" style={{"width": "200px", "paddingLeft": "65px"}}>
                        <div className="other__content">
                          <h3><a href={`https://${document.domain}/admin`}>Admin</a></h3>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <div className="welcome__help">
            <h2>Need help?</h2>
            <HelpButton
                url="https://stackoverflow.com/questions/tagged/api-platform.com"
                Image={Sto}
                title="Ask your questions on Stack Overflow!"
            />
            <HelpButton
                url="https://symfony.com/slack"
                Image={Slack}
                title="Chat with the community on Slack!"
            />
        </div>
    </div>
);

const HelpButton = ({ Image, url, title }) => (
    <a
        target="_blank"
        rel="noopener noreferrer"
        href={url}
        className="help__circle"
        title={title}
    >
        <Image />
    </a>
);

export default Welcome;

const Arrow = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={26}
        height={18}
        viewBox="0 0 25.9 18"
    >
        <style
            type="text/css"
            dangerouslySetInnerHTML={{
                __html:
                    '  \n\t.linkst0{clip-path:url(#SVGID_2_);fill:#FF6600;}\n'
            }}
        />
        <defs>
            <rect width="25.9" height={18} />
        </defs>
        <path
            className="linkst0"
            d="M17 0.3c-0.3-0.4-0.9-0.4-1.3 0 -0.3 0.3-0.3 0.9 0 1.3L22.1 8H0.9C0.4 8 0 8.4 0 8.9c0 0.5 0.4 0.9 0.9 0.9h21.2l-6.4 6.4c-0.3 0.4-0.3 0.9 0 1.3 0.4 0.4 0.9 0.4 1.3 0l8-8c0.4-0.3 0.4-0.9 0-1.3L17 0.3zM17 0.3"
        />
    </svg>
);

const Sto = () => (
    <svg
        width={25}
        height={25}
        viewBox="0 0 120 120"
        style={{ enableBackground: 'new 0 0 120 120' }}
    >
        <style
            type="text/css"
            dangerouslySetInnerHTML={{
                __html: '\n\t.stost0{fill:#BCBBBB;}\n\t.stost1{fill:#F48023;}\n'
            }}
        />
        <polygon
            className="stost0"
            points="84.4,93.8 84.4,70.6 92.1,70.6 92.1,101.5 22.6,101.5 22.6,70.6 30.3,70.6 30.3,93.8 "
        />
        <path
            className="stost1"
            d="M38.8,68.4l37.8,7.9l1.6-7.6l-37.8-7.9L38.8,68.4z M43.8,50.4l35,16.3l3.2-7l-35-16.4L43.8,50.4z M53.5,33.2
	l29.7,24.7l4.9-5.9L58.4,27.3L53.5,33.2z M72.7,14.9l-6.2,4.6l23,31l6.2-4.6L72.7,14.9z M38,86h38.6v-7.7H38V86z"
        />
    </svg>
);

const Slack = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={24}
        height={24}
        viewBox="0 0 120 120"
    >
        <path
            d="M74.8 17.3c-1.5-4.6-6.4-7.1-10.9-5.6 -4.6 1.5-7.1 6.4-5.6 10.9l22.5 69.1c1.5 4.3 6.1 6.7 10.6 5.4 4.6-1.3 7.4-6.2 5.9-10.7L74.8 17.3"
            fill="#DFA22F"
        />
        <path
            d="M40 28.6c-1.5-4.6-6.4-7.1-10.9-5.6 -4.6 1.5-7.1 6.4-5.6 10.9l22.5 69.1c1.5 4.3 6.1 6.7 10.6 5.4 4.6-1.3 7.4-6.2 5.9-10.7L40 28.6"
            fill="#3CB187"
        />
        <path
            d="M103 74.5c4.6-1.5 7.1-6.4 5.6-10.9 -1.5-4.6-6.4-7.1-10.9-5.6L28.6 80.4c-4.3 1.5-6.7 6.1-5.4 10.6 1.3 4.6 6.2 7.4 10.8 5.9L103 74.5"
            fill="#CE1E5B"
        />
        <path d="M43 94l16.5-5.4 -5.4-16.5L37.6 77.5 43 94" fill="#392538" />
        <path
            d="M77.8 82.7c6.2-2 12-3.9 16.5-5.4L88.9 60.8 72.4 66.2 77.8 82.7"
            fill="#BB242A"
        />
        <path
            d="M91.7 39.7c4.6-1.5 7.1-6.4 5.6-10.9 -1.5-4.6-6.4-7.1-10.9-5.6L17.3 45.6c-4.3 1.5-6.7 6.1-5.4 10.6 1.3 4.6 6.2 7.4 10.8 5.9L91.7 39.7"
            fill="#72C5CD"
        />
        <path
            d="M31.7 59.2c4.5-1.5 10.3-3.3 16.5-5.4 -2-6.2-3.9-12-5.4-16.5l-16.5 5.4L31.7 59.2"
            fill="#248C73"
        />
        <path
            d="M66.5 47.9l16.5-5.4c-1.8-5.5-3.6-11-5.4-16.5l-16.5 5.4L66.5 47.9"
            fill="#62803A"
        />
    </svg>
);
