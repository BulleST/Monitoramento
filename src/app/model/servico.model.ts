

export class Node {
    id: number = 0;
    name: string = '';
    report_To: string = '';
    val: number = 0;
    status: string = '';
    type: ServicoTipo = 0;
    sub_Type?: ServicoSubtipo;
    dependsOn: Node[] = [];
    dependents: Node[] = [];
    statusItems: StatusItem[] = [];
    vx: number = 0;
    vy: number = 0;
    vz: number = 0;
    x: number = 0;
    y: number = 0;
    z: number = 0;
}

export class Link {
    source: number = 0;
    target: number = 0;
}

export class Grafico {
    nodes: Node[] = [];
    links: Link[] = [];
    
    constructor(_nodes: Node[] = []) {
        this.nodes = _nodes;
        this.links = [];
        // source depende do target
        _nodes.map(source => {
            source.dependsOn.forEach(target => {
                this.links.push({
                    source: source.id,
                    target: target.id, 
                });
            });
        });
    }
}

export class StatusItem {
    bg: string = '';
    checked_On: Date = new Date;
    item: string = '';
    status: string = '';
    message: string = '';
}

export enum ServicoStatus {
    unknown,
    ok,
    warning,
    down,
}

export enum ServicoSubtipo {
    unknown = 0,
    sqlserver = 1,
    oracle = 2,
    postgres = 3,
}

export enum ServicoTipo {
    unknown = 0,
    database = 1,
    disk = 2,
    sites = 3,
    tasker = 4,
    webservice = 5,
    connectivity = 6,
    vm = 7,
    rpa = 8,
    apis = 9,
}

// var cotPR: Servico = {
//     id: 1,
//     report_To: "email@example.com",
//     name: "COT PR",
//     status: ServicoStatus.warning,
//     tipo: ServicoTipo.dataBase,
// }

// var pld: Servico = {
//     id: 2,
//     report_To: "email@example.com",
//     name: "PLD",
//     status: ServicoStatus.ok,
//     tipo: ServicoTipo.servicos,
// }
// var financas: Servico = {
//     id: 3,
//     report_To: "email@example.com",
//     name: "Finanças",
//     status: ServicoStatus.ok,
//     tipo: ServicoTipo.servicos,
// }
// var ted: Servico = {
//     id: 4,
//     report_To: "email@example.com",
//     name: "TED",
//     status: ServicoStatus.ok,
//     tipo: ServicoTipo.servicos,
// }
// var webService: Servico = {
//     id: 5,
//     report_To: "email@example.com",
//     name: "WebServices TOTVS",
//     status: ServicoStatus.danger,
//     tipo: ServicoTipo.api,
// }
// var pco: Servico = {
//     id: 6,
//     report_To: "email@example.com",
//     name: "PCO",
//     status: ServicoStatus.warning,
//     tipo: ServicoTipo.servicos,
// }
// var processamentoFundos: Servico = {
//     id: 7,
//     report_To: "email@example.com",
//     name: "Processamento de Fundos",
//     status: ServicoStatus.warning,
//     tipo: ServicoTipo.servicos,
// }
// var sqs: Servico = {
//     id: 8,
//     report_To: "email@example.com",
//     name: "Processamento de Fundos",
//     status: ServicoStatus.ok,
//     tipo: ServicoTipo.dataBase,
// }
// var cloudTransfer: Servico = {
//     id: 9,
//     report_To: "email@example.com",
//     name: "Cloud Transfer",
//     status: ServicoStatus.danger,
//     tipo: ServicoTipo.api,
// }
// var cargaIntraday: Servico = {
//     id: 10,
//     report_To: "email@example.com",
//     name: "Carga Intraday",
//     status: ServicoStatus.warning,
//     tipo: ServicoTipo.servicos,
// }
// var aldrin: Servico = {
//     id: 11,
//     report_To: "email@example.com",
//     name: "Carga Intraday",
//     status: ServicoStatus.ok,
//     tipo: ServicoTipo.disco,
// }

// export var servicos: Grafico[] = [
//     {
//         servico: cotPR,
//         dependentes: [
//             { servico: pld },
//             { servico: financas },
//             { servico: ted },
//             { servico: webService, dependentes: [
//                 { servico: pco },
//                 { servico: processamentoFundos },
//             ] },
//         ]
//     }, 
//     { 
//         servico: sqs,
//         dependentes: [
//             { servico: financas },
//             { servico: cloudTransfer, dependentes: [
//                 { servico: cargaIntraday },
//             ] },
//         ]
//     },
//     { 
//         servico: aldrin,
//         dependentes: [
//             { servico: cloudTransfer, dependentes: [
//                 { servico: cargaIntraday },
//             ] },
//         ]
//     }
// ]
