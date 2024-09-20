import { IRequest, IRespose } from '../interfaces';
export type INext = (req?: IRequest, res?: IRespose, next?: INext) => void;
