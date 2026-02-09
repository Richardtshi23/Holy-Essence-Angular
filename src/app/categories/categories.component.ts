import { Component, OnInit } from '@angular/core';

// Define an interface for our category object for better code quality and autocompletion
interface Category {
  name: string;
  link: string;
  image: string;
  tagline: string;        // The benefit-driven tagline for the card
  isBestseller?: boolean; // An optional flag to show the "Bestseller" badge
}

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css'],
  standalone:false// Corrected property is 'styleUrls'
})
export class CategoriesComponent implements OnInit {

  // The main array holding all the data for our premium category cards
  categories: Category[] = [];

  constructor() { }

  ngOnInit(): void {
    // We populate your exact categories array here, enhanced with the new properties.
    this.categories = [
      {
        name: 'Anointing Oil', // Corrected typo from "Anoiniting"
        image: '../../assets/AnointingOil.jpeg',
        link: 'item/category/Oils',
        tagline: 'For Protection & Peace', // Added tagline
        isBestseller: true                 // This will display the "Bestseller" badge
      },
      {
        name: 'Anointing Water',
        image: '../../assets/anointingWaterRed.png',
        link: 'item/category/Water',
        tagline: 'For Cleansing & Renewal' // Added tagline
      },
      {
        name: 'Apparels',
        image: '../../assets/childofgodBeige.png',
        link: 'item/category/Apparel',
        tagline: 'Wear Your Faith Boldly'     // Added tagline
      },
      {
        name: 'Bundles Combo',
        image: '../../assets/anointingWaterBlue.png',
        link: 'item/category/Bundles',
        tagline: 'Complete Blessing Sets'   // Added tagline
      }//,
      //{
      //  name: 'Jewellery',
      //  image: '../../assets/morningWaterGreen.png',
      //  link: 'item/category/Jewellery',
      //  tagline: 'Symbols of Devotion'      // Added tagline
      //},
    ];
  }
}
