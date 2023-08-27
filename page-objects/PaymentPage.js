import { expect } from "@playwright/test"
import { paymentDetails } from "../data/paymentDetails";

export class PaymentPage {
    constructor(page) {
        this.page = page
        this.discountCode = page.frameLocator('[data-qa="active-discount-container"]')
                                .locator('[data-qa="discount-code"]')
        this.discountDescription = this.discountCode.locator('xpath=./preceding-sibling::*[1]');
        this.discountInput = page.locator('[data-qa="discount-code-input"]')
        this.activateDiscountButton = page.getByRole('button', { name: 'Submit discount' })
        this.discountActivatedMessage = page.locator('[data-qa="discount-active-message"]')
        this.totalPrice = page.locator('[data-qa="total-value"]')
        this.totalPriceWithDiscount = page.locator('[data-qa="total-with-discount-value"]')
        this.creditCardOwnerInput = page.getByPlaceholder('Credit card owner')
        this.creditCardNumberInput = page.getByPlaceholder('Credit card number')
        this.creditCardValidUntilInput = page.getByPlaceholder('Valid until')
        this.creditCardCvcInput = page.getByPlaceholder('Credit card CVC')
        this.payButton = page.getByRole('button', { name: 'Pay' })
    }

    activateDiscount = async () => {
        await this.totalPrice.waitFor()
        const totalPriceNumber = parseInt((await this.totalPrice.innerText()).replace("$", ""), 10)

        const extractedDescriptionText = await this.discountDescription.innerText();
        const discountText = extractedDescriptionText.match(/(\d{1,2})%/);
        let discountPercent;
        if (discountText) {
            discountPercent = parseInt(discountText[1], 10);
        }
        // console.warn({discountPercent})
        await this.discountCode.waitFor()
        const code = await this.discountCode.innerText()
        await this.discountInput.waitFor()

        // Option 1 for laggy inputs: using .fill() with await expect()
        await this.discountInput.fill(code)
        await expect(this.discountInput).toHaveValue(code)

        // Option 2 for laggy inputs: slow typing
        // await this.discountInput.focus()
        // await this.page.keyboard.type(code, {delay: 1000})
        // expect(await this.discountInput.inputValue()).toBe(code)

        expect(await this.totalPriceWithDiscount.isVisible()).toBe(false)
        expect(await this.discountActivatedMessage.isVisible()).toBe(false)
        await this.activateDiscountButton.waitFor()
        await this.activateDiscountButton.click()
        await this.discountActivatedMessage.waitFor()
        expect (await this.discountActivatedMessage).toHaveText("Discount activated!")
        await this.totalPriceWithDiscount.waitFor()
        const totalPriceWithDiscountNumber = parseInt((await this.totalPriceWithDiscount.innerText()).replace("$", ""), 10)
        // console.warn({totalPriceNumber})
        // console.warn({totalPriceWithDiscountNumber})
        expect (Math.floor(totalPriceNumber - totalPriceNumber * discountPercent / 100)).toEqual(totalPriceWithDiscountNumber)
    }

    fillPaymentDetails = async (paymentDetails) => {
        await this.creditCardOwnerInput.waitFor()
        await this.creditCardOwnerInput.fill(paymentDetails.cardOwner)
        await this.creditCardNumberInput.waitFor()
        await this.creditCardNumberInput.fill(paymentDetails.cardNumber)
        await this.creditCardValidUntilInput.waitFor()
        await this.creditCardValidUntilInput.focus()
        await this.page.keyboard.type(paymentDetails.cardValidity)
        // await this.creditCardValidUntil.fill(paymentDetails.cardValidity)
        await this.creditCardCvcInput.waitFor()
        await this.creditCardCvcInput.fill(paymentDetails.cvc)
    }

    completePayment = async () => {
        await this.payButton.waitFor()
        await this.payButton.click()
        await this.page.waitForURL(/\/thank-you/, { timeout: 3000 })
    }
}