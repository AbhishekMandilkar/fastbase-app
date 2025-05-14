import React from 'react';
import { Table } from '@tanstack/react-table';
import DataTableV2 from '@/components/database/table-explorer/data-table/data-table-v2';
import ShowQueryDialog from './ShowQueryDialog';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import { AlertCircle } from 'lucide-react';

type DataRecord = Record<string, unknown>

interface ResultsDisplayProps {
  isSQLGenerated: boolean;
  dataResults: DataRecord[];
  table: Table<DataRecord>;
  query: string;
  onClickCopyQuery: () => void;
  error?: string;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({
  isSQLGenerated,
  dataResults,
  table,
  query,
  onClickCopyQuery,
  error
}) => {
  if (!isSQLGenerated) return null;

  const renderNoResults = () => {
    return (
      <div className="flex-1 flex flex-col gap-4 justify-center items-center font-mono">
        <h3>
          The query ran successfully — but there's no matching data.
        </h3>
      </div>
    );
  };

  return (
    <div className="container-sm">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error}
          </AlertDescription>
        </Alert>
      )}
      {dataResults.length > 0 ? (
        <DataTableV2
          table={table}
          containerClassName=" p-2"
          tableClassName="border rounded-md"
        />
      ) : (
        renderNoResults()
      )}
    </div>
  );
};

export default ResultsDisplay; 