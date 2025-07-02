import React from 'react';
import './DashboardContainer.css'; 
import { IonButton } from '@ionic/react';
import AdviceContainer from '../advice/AdviceContainer'
import { useState, useEffect } from 'react';
import { addWaterIntake, addMovement, getDailyStats, getStatsForLastDays } from '../../services/statsServices';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const DashboardContainer: React.FC = () => {
  const [hydration, setHydration] = useState(0); // en mL
  const [hydrationGoal, setHydrationGoal] = useState(3000);
  const [movement, setMovement] = useState(0);
  const [movementGoal, setMovementGoal] = useState(12);

  const refreshStats = async () => {
    const stats = await getDailyStats();
    setHydration(stats.hydration);
    setMovement(stats.movement);
    setHydrationGoal(stats.goalHydration);
    setMovementGoal(stats.goalMovement);
  };

  useEffect(() => {
    refreshStats();
  }, []);

  const handleDrink = async () => {
    await addWaterIntake(100); // +100 mL
    refreshStats();
  };

  const handleMove = async () => {
    await addMovement(); // +1 mouvement
    refreshStats();
  };

  type StatsEntry = {
    date: string;
    hydration: number;
    movement: number;
  };
  
  const [graphData, setGraphData] = useState<StatsEntry[]>([]);

  useEffect(() => {
    refreshStats();
    getStatsForLastDays(7).then(setGraphData);
  }, []);

  return (
    <div className="dashboard-grid">
      <AdviceContainer />
      <div className="dashboard-card">
        <div className="card">          
          <div className="card-content">

            <div className='card-content-title'>
              <div className='card-content-title-content'>Hydratation</div>
              <div className="circle "><img src="images/water-icon.png" alt="water" /></div>
            </div>
            <div className="card-content-main">
              <div className="user-data">
                <span className="user-value">{(hydration).toFixed(1)}</span> mL
              </div>
              <div className="user-objectif">
                🎯 <span className="user-objectif-value">{hydrationGoal}</span> mL
              </div>
            </div>
          </div>            
        </div>

        <div className="button green-button" onClick={handleDrink}>
          +100 mL <img src="images/ok-icon.png" alt="" />
        </div>
      </div>
      <div className="dashboard-card">
        <div className="card">
          
          <div className="card-content">
            <div className='card-content-title'>
              <div className='card-content-title-content'>Mouvements</div>
              <div className="circle"><img src="images/move-icon.png" alt="water" /></div>
            </div>
            <div className="card-content-main">
              <div className="user-data">
                <span className="user-value">{movement}</span> Mouvements
              </div>
              <div className="user-objectif">
                🎯 <span className="user-objectif-value">{movementGoal}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="button green-button" onClick={handleMove}>
          +1 <img src="images/ok-icon.png" alt="" />
        </div>
      </div>

      <div className="dashboard-card full-width ">
        <div className="card">
          {/* <div className="card-content-title">
            <div className="card-content-title-content">Évolution sur 7 jours</div>
          </div> */}
          <p></p>
          <p></p>
          <p></p>
          <p></p>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={graphData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis yAxisId="left" label={{ value: 'Litres', angle: -90, position: 'insideLeft' }} />
              <YAxis yAxisId="right" orientation="right" label={{ value: 'Mouvements', angle: -90, position: 'insideRight' }} />
              <Tooltip />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="hydration" name="Hydratation (L)" stroke="#007bff" />
              <Line yAxisId="right" type="monotone" dataKey="movement" name="Mouvements" stroke="#E85946" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>

    
  );
};

export default DashboardContainer;
