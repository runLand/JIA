
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "erc721a/contracts/ERC721A.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Uints is ERC721A, Ownable {
    

    uint public price = 3000000000000000; //.003 eth


    constructor() ERC721A("UINTS", "UINTS") {}

    function mint(uint quantity) public payable {
        require(msg.value >= quantity * price, "not enough eth");
        handleMint(msg.sender, quantity);
    }

  function handleMint(address recipient, uint quantity) internal {
        uint supply = _totalMinted();
        if (supply >= 1000) {
            require(true,"mint is closed");
        }
        _mint(recipient, quantity);
    }

    function withdraw() external onlyOwner {
        require(payable(msg.sender).send(address(this).balance));
    }


}