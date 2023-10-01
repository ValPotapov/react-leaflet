import Papa, { ParseLocalConfig } from 'papaparse';
import { useState, useEffect } from 'react';
import { camalize } from '../common/utils';
import { RouteDto } from '../models';
import { v4 as uuidv4 } from 'uuid';

export type RouteData = Record<string, RouteDto[]>;
export type ExtraPointsData = RouteDto[];

export const useRoute = (file: File | null) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<any>(null);
  const [dataRoute, setDataRoute] = useState<RouteData>({});
  const [dataExtraPoints, setDataExtraPoints] = useState<ExtraPointsData>([]); // points without routes

  const transformHeader = (header: string) => camalize(header);

  const handleError = (error: any) => {
    setError(error.message);
  };

  const handleParse = (results: any) => {
    const { data: rawData } = results;
    rawData.unicKey = uuidv4()
    const { routeID } = rawData;
    if (routeID === 0 || routeID === '0') {
      setDataExtraPoints((prev: ExtraPointsData) => {
        return [...prev, { ...rawData }];
      });
    } else {
      setDataRoute((prev: RouteData) => {
        const cloneData = Object.assign({}, prev);
        if (!cloneData[routeID]) {
          cloneData[routeID] = [];
        }
        cloneData[routeID].push({ ...rawData });
        return cloneData;
      });
    }
  };

  const config: ParseLocalConfig<RouteDto> = {
    header: true,
    step: handleParse,
    transformHeader: transformHeader,
    error: handleError,
    skipEmptyLines: true // addIgor remove empty string from csv
  };

  useEffect(() => {
    if (!!file) {
      setIsLoading(true);
      Papa.parse(file as any, config);
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file]);

  return { dataRoute, dataExtraPoints, isLoading, error };
};
