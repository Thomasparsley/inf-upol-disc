/**
 * Interface representing a menu reponse for menza
 */
export interface MenzaDataResponse {
    /**
     * List of meals available on the given day in menza
     */
    menu: MenzaMeal[]
}

/**
 * Interface representing a single meal on the menu of menza
 */
export interface MenzaMeal {
    /**
     * Name of the meal
     */
    name: string
    /**
     * Category the meal falls under
     */
    category: string
    /**
     * Amount of the meal that is available
     */
    count: number
    /**
     * Price of the meal
     */
    price: number
}