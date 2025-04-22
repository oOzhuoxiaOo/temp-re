"use client";

import { useEffect, useRef, useState } from "react";
import { Suspense } from "react";
import { LoadingOverlay } from "@mantine/core";
import { toast } from "react-hot-toast";
import * as THREE from "three";
import { GLTFLoader } from "three-stdlib";
import useFile from "../../../store/useFile";
import { validate } from "../../../utils/validate";

const GLTFViewer = ({ gltfData }) => {
  // const containerRef = useRef<HTMLDivElement>(null);
  const getContents = useFile(state => state.getContents);
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(() => true);
    if (gltfData === 0) {
      setLoading(() => false);
      return;
    }

    // scene.add(directionalLight);
    let gltfContent = getContents();
    const blob = new Blob([gltfContent], {
      type: "model/gltf+json",
    });
    // 根据 blob生成 url链接
    let objectURL = URL.createObjectURL(blob);
    validate(objectURL)
      .then(report => {
        if (report.issues.numErrors > 0) {
          console.log("report", report);
          return Promise.reject(report.issues.messages[0].message);
        }
        console.log("验证成功", report);
        URL.revokeObjectURL(url);

        console.log("cccccc", gltfContent);
        setUrl(objectURL);
        setLoading(() => false);
        const animate = () => {
          requestAnimationFrame(animate);
        };
        animate();
      })
      .catch(err => {
        toast.error(err);
        setLoading(() => false);
      });

    return () => {
      // renderer.dispose();
      // scene.clear();
      // container.removeChild(renderer.domElement);
    };
  }, [gltfData]);

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <LoadingOverlay style={{ width: "100%", height: "100%" }} visible={loading} />

      {/* <div ref={containerRef} style={{ width: "100%", height: "20%" }}></div> */}
      {!loading && (
        <model-viewer
          src={url} // 支持本地或外链 glb 文件
          alt="A 3D model"
          auto-rotate
          camera-controls
          shadow-intensity="1"
          style={{ width: "100%", height: "100%" }}
        />
      )}
    </div>
  );
};

export default GLTFViewer;
