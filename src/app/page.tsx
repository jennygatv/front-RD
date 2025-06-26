"use client";
import { useEffect, useState } from "react";
import Particles from "@tsparticles/react";
import { loadFull } from "tsparticles";
import {
  tsParticles,
  type Engine,
  type ISourceOptions,
} from "@tsparticles/engine";
import styles from "@/styles/page.module.css";
import DNAParticles from "@/components/DNAParticles";
import Image from "next/image";
import Header from "@/components/Header";
import { MdFullscreen } from "react-icons/md";
import SearchComponent from "@/components/SearchComponent/SearchComponent";
import { MdCheckCircle, MdRemoveCircle, MdLock } from "react-icons/md";
import { getWorkFlowsWithSources } from "@/services/stage1.service";
import { WorkflowWithSources } from "@/types/workflow.types";

const Home = () => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [workflowWithSources, setWorkflowWithSources] =
    useState<WorkflowWithSources[]>();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    getWorkflowSources();
  }, []);

  const getWorkflowSources = async () => {
    setLoading(true);
    try {
      const response = await getWorkFlowsWithSources();
      if (!response.success) {
      }
      setWorkflowWithSources(response.data);
    } catch (error) {
      console.log("Error getting workflows", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFull(tsParticles as Engine).catch(console.error);
  }, []);

  const particlesOptions: ISourceOptions = {
    fullScreen: { enable: isExpanded ? true : false },
    background: {
      color: { value: "transparent" },
    },
    particles: {
      number: { value: 120, density: { enable: true, width: 700 } },
      color: { value: "#00ffff" },
      links: {
        enable: true,
        color: "#bdffff",
        distance: 150,
        opacity: 0.5,
        width: 1.2,
      },
      move: { enable: true, speed: 1, outModes: { default: "bounce" } },
      size: { value: { min: 1, max: 3 } },
      opacity: { value: 0.6 },
    },
    interactivity: {
      events: {
        onHover: { enable: true, mode: "grab" },
        resize: { enable: true },
      },
      modes: { grab: { distance: 160, links: { opacity: 0.8 } } },
    },
    detectRetina: true,
  };

  return (
    <main className={styles.main} style={{ height: isExpanded ? "100vh" : "" }}>
      {!isExpanded ? <Header /> : null}
      <section
        className={styles.hero}
        style={{
          width: isExpanded ? "100%" : "80%",
          height: isExpanded ? "100vh" : "40vh",
        }}
      >
        <div
          className={`${styles.particlesDiv} ${
            isExpanded ? styles.particlesDivExpanded : styles.particlesDivSmall
          }`}
        >
          {!isExpanded ? (
            <button
              className={styles.expandBtn}
              onClick={() => setIsExpanded(true)}
            >
              <MdFullscreen size={24} />
            </button>
          ) : null}
          <Image
            src="/3d-render-medical-background-with-dna-strands.jpg"
            alt="dna"
            width={5000}
            height={5000}
            className={styles.backgroundImg}
          />
          <Particles
            id="tsparticles"
            className={styles.particles}
            options={particlesOptions}
          />
        </div>
        <SearchComponent
          isExpanded={isExpanded}
          workflowWithSources={workflowWithSources || []}
        />
        {isExpanded ? (
          <button
            className={styles.detailBtn}
            onClick={() => setIsExpanded(false)}
          >
            Más detalles
          </button>
        ) : null}
        {/* <DNAParticles /> */}
      </section>
      {!isExpanded ? (
        loading ? (
          <p>Loading</p>
        ) : (
          <section className={styles.workflows}>
            <h6>Workflows</h6>
            <div className={styles.workflowDiv}>
              {workflowWithSources?.map((workflow) => (
                <div className={styles.sourcesDiv} key={workflow.name}>
                  <div className={styles.source}>
                    <MdCheckCircle size={20} color="#26bf26" />
                    <h6>{workflow.name}</h6>
                  </div>
                  {workflow.steps.map((step) => (
                    <div key={step.step_name} className={styles.source}>
                      {step.status === 200 ? (
                        <MdCheckCircle size={20} color="#26bf26" />
                      ) : (
                        <MdRemoveCircle size={20} color="#bf2626" />
                      )}

                      <p>{step.step_name} </p>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </section>
        )
      ) : null}
    </main>
  );
};

export default Home;
