import Head from "next/head";
import Link from "next/link";

const Welcome = () => (
  <div className="welcome">
    <Head>
      <title>Tutorial API Platform</title>
    </Head>
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
            <a href={`https://nextjs.org/`}><b>Next.js</b></a> application.
          </p>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://github.com/metaclass-nl/tutorial-api-platform/blob/chapter9-api/README.md"
            className="main__button"
          >
            Get started<Arrow />
          </a>
        </div>
        <div className="main__other">
          <h2>Available services:</h2>
          <div className="other__bloc" >
            <div className="other__content">
              <h3><a href={`/docs`}>API</a></h3>
            </div>
          </div>
          <div className="other__bloc" >
            <div className="other__content">
              <h3><Link href={`/admin`}><a>Admin</a></Link></h3>
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
    <style jsx global>{`
@import url('https://fonts.googleapis.com/css?family=Open+Sans:400,700|Roboto+Slab:300,700');

body {
    margin: 0;
}

/***** GLOBAL *****/

.welcome {
    height: 100vh;
    width: 100vw;
    text-align: center;
    color: #1d1e1c;
    font-family: 'Open Sans', sans-serif;
    font-size: 14px;
    overflow: auto;
    background-color: #FFF0DC;
}

.welcome a {
    text-decoration: none;
    color: #FF6600;
    font-weight: bold;
}

.welcome h1 {
    font-family: 'Roboto Slab', serif;
    font-weight: 300;
    font-size: 36px;
    margin: 0 0 10px;
    line-height: 30px;
}

.welcome h1 strong {
    font-weight: 700;
    color: #FF6600;
}

.welcome h2 {
    text-transform: uppercase;
    font-size: 18px;
    font-weight: bold;
    margin: 25px 0 5px;
}

.welcome h3 {
    text-transform: uppercase;
    font-weight: 500;
    color: #FF6600;
    font-size: 16px;
    margin: 0 0 5px;
    display: block;
}

/***** TOP *****/

.welcome__top {
    background-color: #FFF0DC;
    padding-bottom: 40px;
    background: url('https://www.metaclass.nl/images/specifiek/header.jpg') right top no-repeat;;
    background-size: 100%;
}

.welcome__flag {
    transform: rotate(30deg);
    position: fixed;
    right: -190px;
    top: 65px;
    box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.2);
    z-index: 5;
}

/***** MAIN *****/

.welcome__main {
    box-shadow: 0 6px 10px 0 rgba(0, 0, 0, 0.14),
        0 1px 18px 0 rgba(0, 0, 0, 0.12), 0 3px 5px -1px rgba(0, 0, 0, 0.3);
    width: 80%;
    max-width: 1100px;
    margin-left: auto;
    margin-right: auto;
    transform: translateY(-50px);
    background-color: white;
    display: flex;
}

.main__aside {
    background-color: #FFF0DC;
    width: 30%;
    position: relative;
    overflow: hidden;
}

.aside__circle,
.main__aside svg {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
}

.aside__circle {
    background-color: white;
    border-radius: 50%;
    width: 90%;
    height: 0;
    padding-bottom: 90%;
}

.aside__circle:after {
    content: '';
    width: 4px;
    left: calc(50% - 5px);
    top: -50%;
    position: absolute;
    height: 100%;
    background-color: #1d1e1c;
}

.main__aside svg {
    width: 100%;
}

.main__content {
    padding: 30px;
    text-align: center;
    flex: auto;
}
.other__bloc {
    display: inline-flex;
    align-items: center;
    border: 4px solid #FF6600;
    padding: 10px 65px;
    margin: 10px 0;
    height: 170px;
    box-sizing: border-box;
    text-align: left;
    width: 200px;
}

.other__bloc:not(:last-of-type) {
    margin-right: 10px;
    padding-left: 80px;
}

.other__bloc h3:not(:first-child) {
  margin-top: 15px;
  padding-top: 5px;
}

.other__circle {
    width: 110px;
    height: 110px;
    background-color: #FFF0DC;
    border-radius: 50%;
    margin-right:20px;
}

.other__circle svg{
  width: 110px;
}

.buttons__group {
    display: inline-flex;
    vertical-align: center;
}

.buttons__group .buttons__or {
    width: 4px;
    position: relative;
    text-align:center;
}

.buttons__group .buttons__or:before {
    content: 'or';
    font-size: 12px;
    color: #aaa;
    line-height: 18px;
    position: absolute;
    border-radius: 50%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: white;
    width: 18px;
    height: 18px;
}

.buttons__group .other__button:first-child {
    border-radius: 5px 0 0 5px;
    padding-right: 15px;
}

.buttons__group .other__button:last-child {
    border-radius: 0 5px 5px 0;
    padding-left: 15px;
}

a.other__button {
    background-color: #e0e1e2;
    font-size: 11px;
    color: #686e63;
    cursor: pointer;
    padding: 5px 10px;
    display: inline-block;
    transition: all ease 0.2s;
    text-transform: uppercase;
}

.other__button:hover {
    background-color: #FFF0DC;
    color: #FF6600;
}

.main__button {
    display: inline-block;
    padding: 10px 50px 10px 10px;
    border: 3px solid #FF6600;
    font-size: 22px;
    color: #FF6600;
    text-transform: uppercase;
    margin: 15px 0;
    overflow: hidden;
    transition: all ease 0.3s;
    cursor: pointer;
    position: relative;
}

.main__button svg {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    transition: transform ease 0.2s;
}

.main__button:hover {
    background-color: #FFF0DC;
}

.main__button:hover svg {
    transform: translateY(-50%) rotate(35deg);
}

/***** HELP *****/

.welcome__help {
    background-color: white;
    box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.2);
    padding: 10px;
    position: fixed;
    right: -5px;
    top: 50%;
    transform: translateY(-50%);
    border-radius: 5px;
    text-align: center;
}

.welcome__help h2 {
    color: #aaa;
    font-size: 12px;
    margin: 10px 0;
}

.help__circle {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    border: 2px solid #ccc;
    display: block;
    margin: 10px auto;
    transition: all ease 0.2s;
    position:relative;
}

.help__circle svg {
  position:absolute;
  left: 50%;
  top: 50%;
  transform:translate(-50%, -50%);
}

.help__circle:hover {
    border-color: #FF6600;
    background-color: #FFF0DC;
}

/***** MEDIAS *****/

@media (max-width: 1200px) {
    .main__aside,
    .welcome__help {
        display: none;
    }
    .main__content {
        width: 100%;
        padding: 20px;
    }
}

@media (max-width: 600px) {
    .welcome__main {
        width: calc(100% - 40px);
    }
    .welcome h1 {
        display: none;
    }
    .welcome__flag,
    .main__other {
        display: none;
    }
    .main__content {
        padding: 10px;
    }
}
            `}</style>
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
    style={{ enableBackground: 'new 0 0 120 120' } as {}}
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
