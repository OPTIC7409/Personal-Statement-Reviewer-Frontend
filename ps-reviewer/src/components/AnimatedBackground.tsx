// import React from 'react';
// import Particles from "react-tsparticles";
// import { loadFull } from "tsparticles";
// import type { Engine } from "@tsparticles/engine";
// import type { ISourceOptions } from "@tsparticles/engine";

// const particlesOptions: ISourceOptions = {
//   fullScreen: { enable: false },
//   background: {
//     color: {
//       value: "#0d47a1",
//     },
//   },
//   fpsLimit: 120,
//   interactivity: {
//     events: {
//       onClick: {
//         enable: true,
//         mode: "push",
//       },
//       onHover: {
//         enable: true,
//         mode: "repulse",
//       },
//       resize: {
//         enable: true,
//       },
//     },
//     modes: {
//       push: {
//         quantity: 4,
//       },
//       repulse: {
//         distance: 200,
//         duration: 0.4,
//       },
//     },
//   },
//   particles: {
//     color: {
//       value: "#ffffff",
//     },
//     links: {
//       color: "#ffffff",
//       distance: 150,
//       enable: true,
//       opacity: 0.5,
//       width: 1,
//     },
//     collisions: {
//       enable: true,
//     },
//     move: {
//       direction: "none",
//       enable: true,
//       outModes: {
//         default: "bounce",
//       },
//       random: false,
//       speed: 1,
//       straight: false,
//     },
//     number: {
//       density: {
//         enable: true,
//       },
//       value: 80,
//     },
//     opacity: {
//       value: 0.5,
//     },
//     shape: {
//       type: "circle",
//     },
//     size: {
//       value: { min: 1, max: 5 },
//     },
//   },
//   detectRetina: true,
// };

// const AnimatedBackground: React.FC = () => {
//   const particlesInit = React.useCallback(async (engine: Engine) => {
//     await loadFull(engine);
//   }, []);

//   return (
//     <Particles
//       id="tsparticles"
//       init={particlesInit}
//       options={particlesOptions}
//     />
//   );
// };

// export default AnimatedBackground;