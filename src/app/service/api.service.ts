import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor() { }
  
  getCards = () =>
  fetch(`https://api.magicthegathering.io/v1/cards`).then((response) => 
    response.json()
  );

  //PRIMERA OPCION DE DIRECCIONAMIENTO
  getCard = (multiverseid) =>
    fetch(`https://api.magicthegathering.io/v1/cards/${multiverseid}`).then((response) => 
      response.json()
    );

  // SEGUNDA OPCION DE DIRECCIONAMIENTO
  getCard2 = async (multiverseid) => {
    let response : Response = await fetch(`https://api.magicthegathering.io/v1/cards/${multiverseid}`);
    let card = await response.json();
    let fetchs : Array<Response> = card.card.map((url) => fetch(url))
    let responses = await Promise.all(fetchs)
    let responsesToJson = responses.map((response) => response.json())
    card.rulings = await Promise.all(responsesToJson)
    return card
  }
}
