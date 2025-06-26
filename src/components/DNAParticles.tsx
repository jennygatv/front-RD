import { useEffect, useMemo } from "react";
import Particles from "@tsparticles/react";
import { loadFull } from "tsparticles";
import { tsParticles, type ISourceOptions } from "@tsparticles/engine";
import styles from "@/styles/page.module.css";
import { loadPolygonMaskPlugin } from "@tsparticles/plugin-polygon-mask";

const DNAParticles = () => {
  useEffect(() => {
    loadFull(tsParticles)
      .then(() => loadPolygonMaskPlugin(tsParticles))
      .catch(console.error);
  }, []);

  const particlesOptions: ISourceOptions = useMemo(
    () => ({
      fullScreen: { enable: true, zIndex: 0 },
      background: {
        color: { value: "transparent" },
      },
      particles: {
        number: {
          value: 200,
        },
        color: {
          value: "#ffffff",
        },
        shape: {
          type: "circle",
        },
        opacity: {
          value: { min: 0.05, max: 0.4 },
          animation: {
            enable: true,
            speed: 2,
            sync: false,
            mode: "auto",
            startValue: "random",
          },
        },
        size: {
          value: 1,
        },
        move: {
          enable: true,
          speed: 1,
          direction: "none",
          outModes: {
            default: "bounce",
          },
        },
      },
      polygon: {
        draw: {
          enable: true,
          stroke: {
            color: { value: "#fff" },
            width: 1,
            opacity: 0.2,
          },
        },
        enable: true,
        inline: {
          arrangement: "equidistant",
        },
        move: {
          radius: 10,
          type: "path",
        },
        scale: 0.5,
        type: "inline",
        url: "/dna-outline.svg",
        position: {
          x: 50,
          y: 50,
        },
      },
    }),
    []
  );

  return (
    <Particles
      id="tsparticles-dna"
      className={styles.particles}
      options={particlesOptions}
    />
  );
};

export default DNAParticles;
