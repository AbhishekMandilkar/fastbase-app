import useSqlQuery from '../../hooks/use-sql-query';
import {useParams} from 'react-router';
import {useDatabase} from '@/pages/database/slice/database-slice';
import {useQuery} from '@tanstack/react-query';

const TableActionView = (props: {actionsItems: React.ReactNode}) => {


  return (
    <div className="flex items-center space-x-2">
      {props.actionsItems}
    </div>
  )
}

export default TableActionView