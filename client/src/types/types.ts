type Association = {
    id: string;
    titre: string;
    description: string;
    image: string;
    lienContact: string;
    ecole?: string;
}

type Message = {
    id: string;
    titre: string;
    description: string;
}

type Lien = {
    id: string;
    titre: string;
    description: string;
    url: string;
}

type Update = {
    id: string;
    version: string;
    date: string;
    ajouts: string;
    changements: string;
}

type Log = {
    id: string;
    duration: number;
    errorDetails: string;
    ip : string;
    method : string;
    statusCode : number;
    timestamp : string;
    url : string;
    userAgent : string;
}