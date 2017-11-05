var getMOTD = function () {
        doGJRequest("data-store/", "&key=MOTD", function (response) {
            return response.data;
        }, function (error) {
            console.error("Error: " + error);
            throw new Error(error);
        });
    };
// Remove item from bazaar when it is purchased.
Scene_Shop.prototype.doBuy = function (number) {
    $gameParty.loseGold(number * this.buyingPrice());
    $gameParty.gainItem(this._item, number);
    var server_item_id = this._item.id;
    var data_res_;
    if (DataManager.isItem(this._item) == true) {
        data_res_ = "bazaar_items";
        var type = 0;
    } else if (DataManager.isWeapon(this._item) == true) {
        data_res_ = "bazaar_weapons";
        var type = 1;
    } else if (DataManager.isArmor(this._item) == true) {
        data_res_ = "bazaar_armors";
        var type = 2;
    }
    Array.prototype.remove = function (value) {
        var index = this.indexOf(value);
        if (index > -1) {
            this.splice(index, 1);
        }
    }
    doGJRequest("data-store/", "&key=" + data_res_, function (response) {
        var old_array;
        if (response.data === undefined) {
            old_array = [];
        } else {
            old_array = JSON.parse(response.data);
        }
        new_array = old_array;
        new_array.remove(server_item_id);
        console.log("new array:" + new_array);
        BZR_Send(type, JSON.stringify(new_array));
        console.log("Sold Successfuly");
    }, function (error) {
        console.error("Error: " + error);
        throw new Error(error);
    });
    SceneManager.pop();
};

// Get from Bazaar online, data parameters determines what is gathered. 0 for item, 1 for weapon, 2 for armor


function BZR_Get(dataf) {
    var data_res;
    var get_result;
    switch (dataf) {

    case 0:
        data_res = "bazaar_items";
        break;

    case 1:
        data_res = "bazaar_weapons";
        break;

    case 2:
        data_res = "bazaar_armors";
        break;

    default:
        throw new Error("No item type defined.");
    }

    doGJRequest("data-store/", "&key=" + data_res, function (response) {

        return response.data;
    }, function (error) {
        console.error("Error: " + error);
        throw new Error(error);
    });

}

var BZR_Send = function (data, toSend) {
        var data_res;
        switch (data) {

        case 0:
            data_res = "bazaar_items";
            break;

        case 1:
            data_res = "bazaar_weapons";
            break;

        case 2:
            data_res = "bazaar_armors";
            break;

        default:
            throw new Error("No item type defined.");
        }

        doGJRequest("data-store/set/", "&key=" + data_res + "&data=" + toSend, function (response) {
            console.log("Successfuly sent.");
        }, function (error) {
            console.error("Error: " + error);
            throw new Error(error);
        });
    };

var BZR_sellItem = function (id) {
        if ($dataItems[id] === undefined || null || 0) {

        } else {
            var data_res = "bazaar_items"
            doGJRequest("data-store/", "&key=" + data_res,

            function (response) {
                var old_array;
                if (response.data === undefined) {
                    old_array = [];
                } else {
                    old_array = JSON.parse(response.data);
                }
                new_array = old_array;
                new_array.push(id);
                console.log("new array:" + new_array);
                BZR_Send(0, JSON.stringify(new_array));
                console.log("Sold Successfuly");

            }, function (error) {
                console.error("Error: " + error);
                throw new Error(error);
            });
            if ($dataItems[id] == null || undefined) {

            } else {
                $gameParty.gainItem($dataItems[id], -1);
                amount = $dataItems[id].price * 0.75;
                $gameParty.gainGold(amount);
            }
        }
    };


var BZR_sellWeapon = function (id) {
        if ($dataWeapons[id] === undefined || null || 0) {

        } else {
            var data_res = "bazaar_weapons"
            doGJRequest("data-store/", "&key=" + data_res,

            function (response) {
                var old_array;
                if (response.data === undefined) {
                    old_array = [];
                } else {
                    old_array = JSON.parse(response.data);
                }
                new_array = old_array;
                new_array.push(id);
                console.log("new array:" + new_array);
                BZR_Send(1, JSON.stringify(new_array));
                console.log("Sold Successfuly");

            }, function (error) {
                console.error("Error: " + error);
                throw new Error(error);
            });
            if ($dataWeapons[id] == null || undefined) {

            } else {
                $gameParty.gainItem($dataWeapons[id], -1, true);
                amount = $dataWeapons[id].price * 0.75;
                $gameParty.gainGold(amount);
            }
        }
    };

var BZR_sellArmor = function (id) {
        if ($dataArmors[id] === undefined || 0 || null) {

        } else {
            var data_res = "bazaar_armors"
            doGJRequest("data-store/", "&key=" + data_res,

            function (response) {
                var old_array;
                if (response.data === undefined) {
                    old_array = [];
                } else {
                    old_array = JSON.parse(response.data);
                }
                new_array = old_array;
                new_array.push(id);
                console.log("new array:" + new_array);
                BZR_Send(2, JSON.stringify(new_array));
                console.log("Sold Successfuly");

            }, function (error) {
                console.error("Error: " + error);
                throw new Error(error);
            });
            if ($dataArmors[id] == null || undefined) {

            } else {
                $gameParty.gainItem($dataArmors[id], -1, true);
                amount = $dataArmors[id].price * 0.75;
                $gameParty.gainGold(amount);
            }
        }
    };

var BZR_buyItems = function () {
        doGJRequest("data-store/", "&key=bazaar_items", function (response) {
            var items = JSON.parse(response.data);
            var Items_To_Show = [];
            var bazaar_items_ = [];
            for (var i = 0; i < items.length; i++) {
                bazaar_items_[i] = [];
                bazaar_items_[i].push(0);
                bazaar_items_[i].push(items[i]);
                bazaar_items_[i].push(0);
                Items_To_Show.push(bazaar_items_[i]);
            }
            SceneManager.push(Scene_Shop);
            SceneManager.prepareNextScene(Items_To_Show, true);
        }, function (error) {
            console.error("Error: " + error);
            throw new Error(error);
        });

    };

var BZR_buyWeapons = function () {
        doGJRequest("data-store/", "&key=bazaar_weapons", function (response) {
            var items = JSON.parse(response.data);
            var Items_To_Show = [];
            var bazaar_items_ = [];
            for (var i = 0; i < items.length; i++) {
                bazaar_items_[i] = [];
                bazaar_items_[i].push(1);
                bazaar_items_[i].push(items[i]);
                bazaar_items_[i].push(0);
                Items_To_Show.push(bazaar_items_[i]);
            }
            SceneManager.push(Scene_Shop);
            SceneManager.prepareNextScene(Items_To_Show, true);
        }, function (error) {
            console.error("Error: " + error);
            throw new Error(error);
        });
    };

var BZR_buyArmor = function () {
        doGJRequest("data-store/", "&key=bazaar_armors", function (response) {
            var items = JSON.parse(response.data);
            var Items_To_Show = [];
            var bazaar_items_ = [];
            for (var i = 0; i < items.length; i++) {
                bazaar_items_[i] = [];
                bazaar_items_[i].push(2);
                bazaar_items_[i].push(items[i]);
                bazaar_items_[i].push(0);
                Items_To_Show.push(bazaar_items_[i]);
            }
            SceneManager.push(Scene_Shop);
            SceneManager.prepareNextScene(Items_To_Show, true);
        }, function (error) {
            console.error("Error: " + error);
            throw new Error(error);
        });
    };
