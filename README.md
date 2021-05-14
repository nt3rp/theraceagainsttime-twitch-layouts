[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]
[![LinkedIn][linkedin-shield]][linkedin-url]

<!-- PROJECT LOGO -->
<br />
<p align="center">
  <!--a href="https://github.com/nt3rp/theraceagainsttime-twitch-layouts">
    <img src="images/logo.png" alt="Logo" width="80" height="80">
  </a-->

  <h3 align="center">Race Against Time Layouts</h3>

  <p align="center">
    HTML-based OBS layouts and widgets for the Race Against Time's stream
    <br />
    <a href="https://github.com/nt3rp/theraceagainsttime-twitch-layouts"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://github.com/nt3rp/theraceagainsttime-twitch-layouts">View Demo</a>
    ·
    <a href="https://github.com/nt3rp/theraceagainsttime-twitch-layouts/issues">Report Bug</a>
    ·
    <a href="https://github.com/nt3rp/theraceagainsttime-twitch-layouts/issues">Request Feature</a>
  </p>
</p>

<!-- TABLE OF CONTENTS -->
<details open="open">
  <summary><h2 style="display: inline-block">Table of Contents</h2></summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <!--li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li-->
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgements">Acknowledgements</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

## About The Project

<!-- [![Product Name Screen Shot][product-screenshot]](https://example.com) -->

HTML-based OBS layouts and widgets for the Race Against Time's stream.

### Built With

- [Preact](https://preactjs.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [Parcel](https://parceljs.org/)
- [NodeCG](https://www.nodecg.dev/)

<!-- GETTING STARTED -->

## Getting Started

To get a local copy up and running follow these simple steps.

### Prerequisites

- npm
  ```sh
  npm install npm@latest -g
  ```

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/nt3rp/theraceagainsttime-twitch-layouts.git
   ```
2. Install NPM packages
   ```sh
   npm install --legacy-peer-deps
   ```

<!-- USAGE EXAMPLES -->

## Usage

### Starting development

Due to some complications of Parcel and how NodeCG is configured, it is not
possible at the moment to run Parcel directly via the command line. Instead,
a simple build script has been created to handle Parcel's `build` and `watch`
commands (`scripts/bundle`).

1. **Start Parcel in [watch mode](https://v2.parceljs.org/features/cli/#parcel-watch-%3Centries%3E)**

   ```sh
   npm start
   ```

   By default, Parcel will run with [hot module replacement](https://v2.parceljs.org/features/hmr/)
   so any changes made will be immediately reflected in the generated files
   on save.

2. **[Start NodeCG](https://www.nodecg.dev/docs/installing#start)**

Your files should now be accessible via the NodeCG dashboard.

<!-- ROADMAP -->

<!--
## Roadmap

See the [open issues](https://github.com/nt3rp/theraceagainsttime-twitch-layouts/issues) for a list of proposed features (and known issues).
-->

<!-- CONTRIBUTING -->

<!--
## Contributing

Contributions are what make the open source community such an amazing place to be learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
-->

<!-- LICENSE -->

## License

Distributed under the MIT License. See `LICENSE` for more information.

<!-- CONTACT -->

## Contact

Nick Terwoord - [@nt3rp](https://twitter.com/nt3rp) - me@nt3rp.io

Project Link: [https://github.com/nt3rp/theraceagainsttime-twitch-layouts](https://github.com/nt3rp/theraceagainsttime-twitch-layouts)

<!-- ACKNOWLEDGEMENTS -->

## Acknowledgements

- [Best-README-Template](https://github.com/othneildrew/Best-README-Template/)

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[contributors-shield]: https://img.shields.io/github/contributors/nt3rp/theraceagainsttime-twitch-layouts.svg?style=for-the-badge
[contributors-url]: https://github.com/nt3rp/theraceagainsttime-twitch-layouts/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/nt3rp/theraceagainsttime-twitch-layouts.svg?style=for-the-badge
[forks-url]: https://github.com/nt3rp/theraceagainsttime-twitch-layouts/network/members
[stars-shield]: https://img.shields.io/github/stars/nt3rp/theraceagainsttime-twitch-layouts.svg?style=for-the-badge
[stars-url]: https://github.com/nt3rp/theraceagainsttime-twitch-layouts/stargazers
[issues-shield]: https://img.shields.io/github/issues/nt3rp/theraceagainsttime-twitch-layouts.svg?style=for-the-badge
[issues-url]: https://github.com/nt3rp/theraceagainsttime-twitch-layouts/issues
[license-shield]: https://img.shields.io/github/license/nt3rp/theraceagainsttime-twitch-layouts.svg?style=for-the-badge
[license-url]: https://github.com/nt3rp/theraceagainsttime-twitch-layouts/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/nt3rp
