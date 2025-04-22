"use client";

import { useEffect, useRef, useState } from "react";
import { LoadingOverlay } from "@mantine/core";
import { validateBytes } from "gltf-validator";
import { toast } from "react-hot-toast";
import * as THREE from "three";
import { GLTFLoader } from "three-stdlib";
import useFile from "../../../store/useFile";
import { validate } from "../../../utils/validate";
import useGraph from "../../editor/views/GraphView/stores/useGraph";

const GLTFViewertt = ({ gltfData }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const getContents = useFile(state => state.getContents);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(() => true);
    const container = containerRef.current;

    if (!container || gltfData === 0) {
      setLoading(() => false);
      return;
    }
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(3, 3, 5); // 设置相机位置
    camera.lookAt(0, 0, 0); // 确保相机看向场景中心

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 1); // 环境光
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5); // 方向光
    directionalLight.position.set(5, 10, 7.5);

    // 创建一个目标对象并将其设置为光源的子对象
    const lightTarget = new THREE.Object3D();
    lightTarget.position.set(0, 0, -1); // 设置目标位置
    directionalLight.add(lightTarget); // 将目标添加为光源的子对象
    directionalLight.target = lightTarget; // 设置光源的目标

    scene.add(directionalLight);
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
        const loader = new GLTFLoader();
        // console.log("dddddddd", getContents());

        // const gltf = loader.parse(gltfContent, "", gltf => {
        //   console.log("aaa", gltf);
        //   scene.add(gltf.scene);
        // });
        // Load a glTF resource
        console.log("cccccc", gltfContent);

        loader.load(
          // resource URL
          objectURL,
          // called when the resource is loaded
          function (gltf) {
            setLoading(() => false);
            console.log("完成", gltf);
            scene.add(gltf.scene);
            // 释放 blob URL
            URL.revokeObjectURL(objectURL);
          },
          // called while loading is progressing
          function (xhr) {
            console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
          },
          // called when loading has errors
          function (error) {
            console.log("An error happened", error);
            setLoading(() => false);
            URL.revokeObjectURL(objectURL);
          }
        );

        const animate = () => {
          requestAnimationFrame(animate);
          renderer.render(scene, camera);
        };
        animate();
      })
      .catch(err => {
        toast.error(err);
        setLoading(() => false);
      });

    return () => {
      renderer.dispose();
      scene.clear();
      container.removeChild(renderer.domElement);
    };
  }, [gltfData]);

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <LoadingOverlay style={{ width: "100%", height: "100%" }} visible={loading} />
      <div ref={containerRef} style={{ width: "100%", height: "20%" }}></div>
      <button onClick={() => console.log(getContents())}>222222222222</button>
    </div>
  );
};

export default GLTFViewer;
