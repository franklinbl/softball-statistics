import LatestGamesCard from '../components/LatestGamesCard';
import Tournaments from './Tournaments';

const Home: React.FC = () => {

  return (
    <div className="text-center">
      <LatestGamesCard />
      <Tournaments />
    </div>
  );
};

export default Home;