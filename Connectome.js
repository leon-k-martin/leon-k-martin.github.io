import React, { useState, useEffect, useRef } from 'react';
import { ForceGraph3D } from 'react-force-graph';

const Connectome = () => {
    const [cameraPosition, setCameraPosition] = useState({ x: 0, y: 0, z: 300 });


    const [graphData, setGraphData] = useState({ nodes: [], links: [] });
    const [nodeRelSize, setNodeRelSize] = useState(2);
    const [isForceApplied, setIsForceApplied] = useState(false);

    const fgRef = useRef();

    useEffect(() => {
        fetch('graphData2.json')
            .then(response => response.json())
            .then(data => setGraphData(data))
            .catch(error => console.error(error));
    }, []);

    const resetView = () => {
        fgRef.current.zoomToFit();
    };

    const toggleForce = () => {
        setIsForceApplied(!isForceApplied);
    };

    useEffect(() => {
        // const chargeStrength = isForceApplied ? -120 : -30;
        fgRef.current.d3Force('charge').strength(-120);

        if (!isForceApplied) {
            // Reheat simulation for minor adjustments when force is not applied
            // fgRef.current.d3Force('link').strength(0);
            fgRef.current.cooldownTicks = 0;
            fgRef.current.d3ReheatSimulation();
        }
    }, [isForceApplied]);

    const handleNodeRelSizeChange = (event) => {
        setNodeRelSize(Number(event.target.value));
    };

    useEffect(() => {
        if (fgRef.current) {
            // Move camera to the new position with an animated transition
            fgRef.current.cameraPosition(
                { x: cameraPosition.x, y: cameraPosition.y, z: cameraPosition.z }, // new position
                { x: 0, y: 0, z: 0 }, // lookAt ({ x: 0, y: 0, z: 0 } for the center of the graph)
                1000 // ms transition duration
            );
        }
    }, [cameraPosition]); // Depend on cameraPosition state to trigger effect

    // Example function to update camera position state
    const moveToPosition = (x, y, z) => {
        setCameraPosition({ x, y, z });
    };



    return (
        <div>
            <ForceGraph3D
                ref={fgRef}
                graphData={graphData}
                nodeLabel="id"
                nodeAutoColorBy="group"
                nodeRelSize={nodeRelSize}
                nodeOpacity={0.9}
                warmupTicks={0}
                cooldownTicks={isForceApplied ? Infinity : 0} // Dynamically adjust based on isForceApplied
                linkWidth={0.1}
                linkDirectionalParticleWidth={d => d.value / 50}
                linkDirectionalParticles="value"
                linkDirectionalParticleSpeed={d => d.value ** 0.003}
            />
            <div className='buttons'>
                <button onClick={resetView}>Reset View</button>
                <button onClick={toggleForce}>{isForceApplied ? 'Brain' : 'Force'}</button>

                <button onClick={() => moveToPosition(0, 0, 300)}>Top View</button>
                <button onClick={() => moveToPosition(300, 0, 0)}>Side View</button>
                <button onClick={() => moveToPosition(0, 300, 0)}>Front View</button>
            </div>
            <div className='sliders'>
                <label htmlFor="nodeRelSize">Node Size:</label>
                <input
                    type="range"
                    id="nodeRelSize"
                    name="nodeRelSize"
                    min="1"
                    max="20"
                    value={nodeRelSize}
                    // onChange={toggleForce}
                    onChange={handleNodeRelSizeChange}
                />
                <span>{nodeRelSize}</span>
            </div>
        </div>
    );
};

export default Connectome;
