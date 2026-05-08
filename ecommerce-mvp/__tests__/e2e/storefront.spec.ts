/**
 * E2E Tests: Storefront & Product Catalog
 * Tests the browse and product detail flows.
 * Run against: http://localhost:3000 (next dev or next start)
 */

import { test, expect } from '@playwright/test'

test.describe('Storefront — Catalog Page', () => {
  test('should load the home page with page title', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/QA Team|Store/i)
  })

  test('should display the QA Team Store header', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByText('QA Team Store')).toBeVisible()
  })

  test('should display at least one product card', async ({ page }) => {
    await page.goto('/')
    // Wait for product grid to render
    const productCards = page.locator('.grid > div, [data-testid="product-card"]')
    await expect(productCards.first()).toBeVisible({ timeout: 10000 })
  })

  test('should show product name and price on each card', async ({ page }) => {
    await page.goto('/')
    // The Playwright Starter Kit is in seed data
    await expect(page.getByText('Playwright Starter Kit')).toBeVisible()
    // Price format: $29.99
    await expect(page.getByText('$29.99')).toBeVisible()
  })

  test('should have a link to the cart', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('link', { name: /cart/i })).toBeVisible()
  })

  test('should show hero section with heading', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByText('Level Up Your QA Skills')).toBeVisible()
  })

  test('should navigate to product detail when clicking View Details', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('link', { name: 'View Details' }).first().click()
    await expect(page.url()).toContain('/products/')
  })
})

test.describe('Product Detail Page', () => {
  test('should display product name and price', async ({ page }) => {
    await page.goto('/products/playwright-starter-kit')
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Playwright Starter Kit')
    await expect(page.getByText('$29.99')).toBeVisible()
  })

  test('should display product description', async ({ page }) => {
    await page.goto('/products/playwright-starter-kit')
    await expect(page.getByText(/starter kit for end-to-end testing/i)).toBeVisible()
  })

  test('should have Add to Cart button', async ({ page }) => {
    await page.goto('/products/playwright-starter-kit')
    await expect(page.getByRole('button', { name: /add to cart/i })).toBeVisible()
  })

  test('should have Buy Now link', async ({ page }) => {
    await page.goto('/products/playwright-starter-kit')
    await expect(page.getByRole('link', { name: /buy now/i })).toBeVisible()
  })

  test('should show what is included section', async ({ page }) => {
    await page.goto('/products/playwright-starter-kit')
    await expect(page.getByText("What's included:")).toBeVisible()
    await expect(page.getByText('Instant digital download')).toBeVisible()
  })

  test('should have breadcrumb navigation back to home', async ({ page }) => {
    await page.goto('/products/playwright-starter-kit')
    await expect(page.getByRole('link', { name: 'Home' })).toBeVisible()
  })

  test('should return 404 for non-existent product', async ({ page }) => {
    const response = await page.goto('/products/does-not-exist-xyzzy')
    // Next.js notFound() returns 404
    expect(response?.status()).toBe(404)
  })

  test('should navigate back to catalog via Back link', async ({ page }) => {
    await page.goto('/products/playwright-starter-kit')
    await page.getByRole('link', { name: /back to all products/i }).click()
    await expect(page.url()).toMatch(/\/$|\/index/)
  })
})

test.describe('Cart Page', () => {
  test('should load the cart page', async ({ page }) => {
    await page.goto('/cart')
    await expect(page.getByRole('heading', { name: 'Your Cart' })).toBeVisible()
  })

  test('should show link back to store from cart', async ({ page }) => {
    await page.goto('/cart')
    await expect(page.getByRole('link', { name: /continue shopping/i })).toBeVisible()
  })
})
