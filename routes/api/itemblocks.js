const express = require('express');
const router = express.Router();
const passport = require('passport');
const dotenv = require('dotenv');

// Point to the file storing environment variables, in order to use them in the nodejs app
dotenv.config({ path: './.env' });	

const iblockController = require('../../controllers/itemblocksController');
const authMiddleware = require('../../middleware/authorization');

/**
 * @api {post} /create Creates an item block in our database
 * @apiName CreateItemBlock
 * @apiGroup ItemBlocks
 *
 * @apiParam {Object} contents Object that includes attributes that are added when creating profile block, REQUIRED
 *
 * @apiParamExample Example Body: 
 * {
 *     "contents": {
 *         "type": "Project",
 *         "title": "Test"
 *     }
 * }
 *
 * @apiSuccess {String} status Item block creation result
 * @apiSuccess {Object} item The created item block
 *
 * @apiSuccessExample Successful Response:
 * HTTP/1.1 201 OK
 * {
 *     "status": "Item block has been successfully created",
 *     "item": {
 *	        "urlThumbnail": "Thumbnail",
 *	        "_id": "5f826c26fa1ff03fc7998402",
 *	        "user_id": "ajfiajijf892jfaiojio",
 *	        "type": "Project",
 *	        "title": "Test",
 *	        "description": "",
 *	        "date": "2020-10-11T02:21:26.649Z",
 *	        "__v": 0
 *   	}
 * }
 *
 * @apiError RequiredDetailsMissing Required parameters not provided
 * 
 * @apiErrorExample Error-Response: 
 * HTTP/1.1 401 Unauthorized
 * {
 *     "status": "Missing either type of item block, its title or the contents body"
 * }
 */
router.use('/create', authMiddleware.authenticateJWT);
router.use('/create', iblockController.checkCreateBody);
router.use('/create', iblockController.checkNumLimit);
router.route('/create')
	.post(iblockController.createItem);

/**
 * @api {post} /update Updates an item block in our database
 * @apiName UpdateItemBlock
 * @apiGroup ItemBlocks
 *
 * @apiParam {String} item_id ID of an item block you're trying to update, REQUIRED
 * @apiParam {Object} contents Object that includes attributes of an item block you're trying to change, REQUIRED
 *
 * @apiParamExample Example Body: 
 * {
 *     "item_id": "lkjalksfi98789348915987897",
 *     "contents": {
 *	       "title": "Test Update",
 *         "description": "Test Update"
 *     }
 * }
 *
 * @apiSuccess {String} status Item block update result
 * @apiSuccess {Object} item Updated item block details
 *
 * @apiSuccessExample Successful Response:
 * HTTP/1.1 200 OK
 * {
 *     "status": "Item block has been successfully updated"
 *     "item": {
 *         "_id": "lkjalksfi98789348915987897",
 *         "title": "Test Update",
 *         "description": "Test Update",
 *         "__v": "0",
 *         "type": "Education",
 *         "user_id": "ajfij92348988afjaklfjajl"	
 *     }
 * }
 *
 * @apiError RequiredDetailsMissing Required parameters not provided
 * 
 * @apiErrorExample Error-Response: 
 * HTTP/1.1 401 Unauthorized
 * {
 *     "status": "Missing either item id or the body of change"
 * }
 */
router.use('/update', authMiddleware.authenticateJWT);
router.use('/update', iblockController.checkUpdateBody);
router.use('/update', authMiddleware.authenticateUser);
router.route('/update')
	.post(iblockController.updateItem);

/**
 * @api {post} /delete deletes an item block from our database
 * @apiName DeleteItemBlock
 * @apiGroup ItemBlocks
 *
 * @apiParam {String} item_id ID of an item block you're trying to delete, REQUIRED
 *
 * @apiParamExample Example Body: 
 * {
 *     "item_id": "lkjalksfi98789348915987897"
 * }
 *
 * @apiSuccess {String} status Item block deletion result
 *
 * @apiSuccessExample Successful Response:
 * HTTP/1.1 200 OK
 * {
 *     "status": "Item block has been successfully deleted"
 * }
 *
 * @apiError RequiredDetailsMissing Required parameters not provided
 * 
 * @apiErrorExample Error-Response: 
 * HTTP/1.1 401 Unauthorized
 * {
 *     "status": "Missing item id"
 * }
 */
router.use('/delete', authMiddleware.authenticateJWT);
router.use('/delete', iblockController.checkDeleteBody);
router.use('/delete', authMiddleware.authAdminUser);
router.route('/delete')
	.post(iblockController.deleteItem);

/**
 * @api {post} /see searches for a particular item block from our database
 * @apiName SearchItemBlock
 * @apiGroup ItemBlocks
 *
 * @apiParam {String} item_id ID of an item block you're trying to search, REQUIRED
 *
 * @apiParamExample Example Body: 
 * {
 *     "item_id": "5f81bdf6db99e33e48002c54"
 * }
 *
 * @apiSuccess {String} status Item block search result
 * @apiSuccess {Object} itemblock item block
 *
 * @apiSuccessExample Successful Response:
 * HTTP/1.1 200 OK
 * {
 *     "status": "Item block has been successfully found",
 *     "itemblock": {
 *	        "urlThumbnail": "Thumbnail",
 *          "_id": "5f81bdf6db99e33e48002c54",
 *          "user_id": "5f7a7f7240e08a0017990a5e",
 *          "type": "Project",
 *          "title": "Test",
 *          "description": "",
 *          "date": "2020-10-10T13:58:14.064Z",
 *          "__v": 0	
 *     }
 * }
 *
 * @apiError RequiredDetailsMissing Required parameters not provided
 * 
 * @apiErrorExample Error-Response: 
 * HTTP/1.1 401 Unauthorized
 * {
 *     "status": "Missing item id"
 * }
 */
router.use('/see', iblockController.checkSeeBody);
router.route('/see')
	.post(iblockController.seeItem);

/**
 * @api {post} /seeall searches for all item blocks produced by a particular user from our database
 * @apiName SearchItemBlocks
 * @apiGroup ItemBlocks
 *
 * @apiParam {String} user_id ID of user, REQUIRED
 *
 * @apiParamExample Example Body: 
 * {
 *     "user_id": "5f7a7f7240e08a0017990a5e"
 * }
 *
 * @apiSuccess {String} status Item block search result
 * @apiSuccess {Object} itemblocks list of item blocks
 *
 * @apiSuccessExample Successful Response:
 * HTTP/1.1 200 OK
 * {
 *     "status": "Item block has been successfully found",
 *     "itemblocks": [
 *	 	    {
 *	  	        "urlThumbnail": "Thumbnail",
 *	 	        "_id": "5f81bdf6db99e33e48002c54",
 * 	 	        "user_id": "5f7a7f7240e08a0017990a5e",
 *	 	        "type": "Project",
 *	 	        "title": "Test",
 *	 	        "description": "",
 * 	 	        "date": "2020-10-10T13:58:14.064Z",
 *	  	        "__v": 0
 *	 	    },
 *	 	    {
 *	 	        "urlThumbnail": "Thumbnail",
 *	 	        "_id": "5f81bdfedb99e33e48002c55",
 *	 	        "user_id": "5f7a7f7240e08a0017990a5e",
 *	 	        "type": "Education",
 *	 	        "title": "Test 2",
 *	 	        "description": "",
 *	 	        "date": "2020-10-10T13:58:22.794Z",
 *	 	        "__v": 0
 *	 	    }
 *      ]
 * }
 *
 * @apiError RequiredDetailsMissing Required parameters not provided
 * 
 * @apiErrorExample Error-Response: 
 * HTTP/1.1 401 Unauthorized
 * {
 *     "status": "Missing user id"
 * }
 */
router.route('/seeall')
	.post(iblockController.seeAllItems);

module.exports = router;