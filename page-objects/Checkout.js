import { expect } from "@playwright/test"

export class Checkout {
    constructor(page) {
        this.page = page

        this.basketCards = page.locator('[data-qa="basket-card"]')
        this.basketItemPrice = page.locator('[data-qa="basket-item-price"]')
        this.basketRemoveItemButton = page.locator('[data-qa="basket-card-remove-item"]')
        this.basketContinueToCheckoutButton = page.locator('[data-qa="continue-to-checkout"]')
    }

    removeCheapestProduct = async () => {
        await this.basketCards.first().waitFor()
        const itemsBeforeRemoval = await this.basketCards.count()
        await this.basketItemPrice.first().waitFor()
        const allPriceTexts = await this.basketItemPrice.allInnerTexts()
        const priceNumbers = allPriceTexts.map((element) => {
            const withoutDollarSign = element.replace("$", "")
            return parseInt(withoutDollarSign, 10)
        })
        // console.warn({allPriceTexts})
        // console.warn({priceNumbers})
        const smallestPrice = Math.min(...priceNumbers)
        const smallestPriceIndex = priceNumbers.indexOf(smallestPrice)
        const specificRemoveButton = this.basketRemoveItemButton.nth(smallestPriceIndex)
        // console.warn({smallestPrice})
        // console.warn({smallestPriceIndex})
        // console.warn({specificRemoveButton})
        await specificRemoveButton.waitFor()
        await specificRemoveButton.click()
        await expect(this.basketCards).toHaveCount(itemsBeforeRemoval - 1)
    }

    continueToCheckout = async () => {
        await this.basketContinueToCheckoutButton.waitFor()
        await this.basketContinueToCheckoutButton.click()
        await this.page.waitForURL(/\/login/, {timeout: 3000})
    }
}