import { expect } from "@playwright/test"
import { Navigation } from "./Navigation.js"
import { isDesktopViewport } from "../utils/isDesktopViewport.js"

export class ProductsPage {
    constructor(page) {
        this.page = page

        this.addButtons = page.locator('[data-qa="product-button"]')
        this.sortDropdown = page.locator('[data-qa="sort-dropdown"]')
        this.productTitles = page.locator('[data-qa="product-title"]')
    }

    visit = async () => {
        await this.page.goto("/")
    }

    addProductToBasket = async (index) => {
        const navigation = new Navigation(this.page)
        const specificAddButton = this.addButtons.nth(index)
        await specificAddButton.waitFor()
        await expect(specificAddButton).toHaveText("Add to Basket")
        //  Only desktop viewport
        let basketCountBeforeAdding = 0
        if (isDesktopViewport(this.page)) {
            const basketCountBeforeAdding = await navigation.getBasketCount()
        }

        await specificAddButton.click()
        await expect(specificAddButton).toHaveText("Remove from Basket")
        // Only desktop viewport
        if (isDesktopViewport(this.page)) {
            const basketCountAfterAdding = await navigation.getBasketCount()
            expect(basketCountAfterAdding).toBeGreaterThan(basketCountBeforeAdding)
        }
    }

    sortByCheapest = async () => {
        await this.sortDropdown.waitFor()
        await this.productTitles.first().waitFor()
        const productTitlesBeforeSorting = await this.productTitles.allInnerTexts()
        await this.sortDropdown.selectOption('price-asc')
        const productTitlesAfterSorting = await this.productTitles.allInnerTexts()
        expect(productTitlesAfterSorting).not.toEqual(productTitlesBeforeSorting)
    }
}