import { PeriodicidadPla } from './PeriodicidadPla';
import { ProgramacionPlaPK } from './ProgramacionPlaPK';
import { TiposPlanilla } from './TiposPlanilla';


 export class ProgramacionPla {
    anio: number;
    anioReportar: number;
    codEmpRealiza: number;
    codTipoPlaLiq: number;
    comentario: string;
    descontar: string;
    diasProyectar: number;
    factorCambiario: number;
    fecEnded: Date;
    fecInitial: Date;
    fecha: Date;
    fechaCalculo: Date;
    fechaFinHx: string;
    fechaFinNoct: Date;
    fechaFinal: string;
    fechaInicial: string;
    fechaInicioHx: string;
    fechaInicioNoct: string;
    fechaLiqVacacion: Date;
    fechaLiquidacion: Date;
    fechaPago: Date;
    mes: number;
    mesReportar: number;
    numPlanilla: number;
    observacion: string;
    periodicidadPla: PeriodicidadPla;
    periodoContable: number;
    pkAsString: string;
    prestamos: string;
    programacionPlaPK: ProgramacionPlaPK;
    quincena: number;
    status: string;
    tiposPlanilla: TiposPlanilla;
    validadoAuditor: number;
    stringMes: string;
    stringProgramacionPlaHx: string;
    stringQuincena: string;

    constructor(){

    }


}
