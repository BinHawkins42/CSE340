const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("getclassificationsbyid error " + error)
  }
}

/* ***************************
 *  Get all inventory items for detail veiw
 * ************************** */
async function getInventoryByInvId(Inv_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory
      WHERE inv_id = $1`,
      [Inv_id]
    )
    return data.rows
  } catch (error) {
    console.error("getclassificationsbyid error " + error)
  }
}

/* *****************************
*   add new classification
* *************************** */
async function addnewclass(classification_name){
    try {
      const sql = 
      "INSERT INTO public.classification (classification_name) VALUES ($1) RETURNING *"
      return await pool.query(sql, [classification_name])
    } catch (error) {
      return error.message
    }
  }

  // search bar

  async function searchInv(search_values){
    // Check if search_values is an array
    if (!Array.isArray(search_values)) {
        console.error('search_values is not an array');
        return []; // Return an empty array or handle the error accordingly
    }

    // Proceed with mapping if search_values is an array
   
    const array = search_values.map(search_value => `'%${search_value}%'`);

    try {
      const sql = `
      SELECT DISTINCT * 
      FROM public.inventory 
      WHERE
      CONCAT(inv_make, ' ', inv_model, ' ', inv_description, ' ', inv_year, ' ', inv_price, ' ', inv_miles, ' ', inv_color) ILIKE ALL (array[${array}])`;
        const data = await pool.query(sql)
         return data.rows
    } catch (error) {
        console.error('model error: ' + error);
        return []; // Return an empty array or handle the error accordingly
    }
  }
  /*****************************
   * add new inventory
   * ***************************/
  async function AddNewInv({classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color}){
    try {
      const sql = 
      "INSERT INTO public.inventory (classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *";
      return await pool.query(sql, [classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color])
    } catch (error) {
      return error.message
    }
  }

  /* ***************************
 *  Update Inventory Data
 * ************************** */
async function updateInventory({
  inv_make,
  inv_model,
  inv_description,
  inv_image,
  inv_thumbnail,
  inv_price,
  inv_year,
  inv_miles,
  inv_color,
  classification_id,
  inv_id
}) {
  try {
    const sql =
      "UPDATE public.inventory SET inv_make = $1, inv_model = $2, inv_description = $3, inv_image = $4, inv_thumbnail = $5, inv_price = $6, inv_year = $7, inv_miles = $8, inv_color = $9, classification_id = $10, WHERE inv_id = $11 RETURNING *"
    const data = await pool.query(sql, [
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      classification_id,
      inv_id
    ])
    console.log(data.rows)
    return data.rows[0]
  } catch (error) {
    console.error("model error: " + error)
  }
}
  
// delete invetory item

async function deleteInventoryItem(inv_id) {
  try {
    const sql = 'DELETE FROM inventory WHERE inv_id = $1'
    const data = await pool.query(sql, [inv_id])
  return data
  } catch (error) {
    new Error("Delete Inventory Error")
  }
}


module.exports = {getClassifications, getInventoryByClassificationId, getInventoryByInvId, addnewclass, AddNewInv, updateInventory, deleteInventoryItem, searchInv}