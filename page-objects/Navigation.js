import { isDesktopViewport } from "../utils/isDesktopViewport"

export class Navigation {
    constructor(page) {
        this.page = page

        this.basketCounter = page.locator('[data-qa="header-basket-count"]')
        this.checkoutLink = page.getByRole('link', { name: 'Checkout' })
        this.mobileBurgerButton = page.locator('[data-qa="burger-button"]')
    }

    getBasketCount = async () => {
        const text = await this.basketCounter.innerText()
        const asNumber = parseInt(text, 10)
        return asNumber
    }

    goToCheckout = async () => {
        // if mobile viewport, first open the burger menu
        if (!isDesktopViewport(this.page)) {
            await this.mobileBurgerButton.waitFor()
            await this.mobileBurgerButton.click()
        }
        await this.checkoutLink.waitFor()
        await this.checkoutLink.click()
        await this.page.waitForURL("/basket")
    }
}


