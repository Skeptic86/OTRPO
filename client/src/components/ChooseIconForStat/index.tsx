import { StatsEnum } from '../PokemonCard';
import styles from './ChooseIconForStat.module.scss';

import FavoriteIcon from '@mui/icons-material/Favorite';
import SportsMmaIcon from '@mui/icons-material/SportsMma';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import { IStats } from '../../types/pokemon.interface';

type TChooseIconForStatProps = {
  stat: IStats;
};

const ChooseIconForStat: React.FC<TChooseIconForStatProps> = ({ stat }) => {
  const iconName = stat.stat.name;
  if (iconName === StatsEnum.HP) {
    return (
      <div className={styles.pokemon_stats}>
        <FavoriteIcon />
        <p>{stat.base_stat}</p>
      </div>
    );
  } else if (iconName === StatsEnum.ATTACK) {
    return (
      <div className={styles.pokemon_stats}>
        <SportsMmaIcon />
        <p>{stat.base_stat}</p>
      </div>
    );
  } else if (iconName === StatsEnum.SPEED) {
    return (
      <div className={styles.pokemon_stats}>
        <DirectionsRunIcon />
        <p>{stat.base_stat}</p>
      </div>
    );
  }
  return <></>;
};

export default ChooseIconForStat;
