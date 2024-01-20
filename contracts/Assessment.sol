// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Assessment {
    address payable public owner;
    uint256 public balance;
    mapping(address => uint256) public cryptoHoldings;

    event Deposit(uint256 amount);
    event Withdraw(uint256 amount);
    event BuyBitcoin(address indexed buyer, uint256 amount, uint256 cost);
    event SellBitcoin(address indexed seller, uint256 amount, uint256 revenue);

    constructor(uint256 initBalance) payable {
        owner = payable(msg.sender);
        balance = initBalance;
    }

    function getBalance() public view returns(uint256) {
        return balance;
    }

    function deposit(uint256 _amount) public payable {
        uint _previousBalance = balance;
        require(msg.sender == owner, "You are not the owner of this account");
        balance += _amount;
        assert(balance == _previousBalance + _amount);
        emit Deposit(_amount);
    }

    error InsufficientBalance(uint256 balance, uint256 withdrawAmount);

    function withdraw(uint256 _withdrawAmount) public {
        require(msg.sender == owner, "You are not the owner of this account");
        uint _previousBalance = balance;
        if (balance < _withdrawAmount) {
            revert InsufficientBalance({
                balance: balance,
                withdrawAmount: _withdrawAmount
            });
        }
        balance -= _withdrawAmount;
        assert(balance == (_previousBalance - _withdrawAmount));
        emit Withdraw(_withdrawAmount);
    }

    function buyBitcoin(uint256 _amount, uint256 _cost) public payable {
        require(msg.sender == owner, "You are not the owner of this account");
        require(balance >= _cost, "Insufficient balance to buy Bitcoin");
        cryptoHoldings[msg.sender] += _amount;
        balance -= _cost;
        emit BuyBitcoin(msg.sender, _amount, _cost);
    }

    function sellBitcoin(uint256 _amount, uint256 _revenue) public {
        require(msg.sender == owner, "You are not the owner of this account");
        require(cryptoHoldings[msg.sender] >= _amount, "Insufficient Bitcoin holdings to sell");
        cryptoHoldings[msg.sender] -= _amount;
        balance += _revenue;
        emit SellBitcoin(msg.sender, _amount, _revenue);
    }
}
