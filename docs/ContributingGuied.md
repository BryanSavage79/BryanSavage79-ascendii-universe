# Contributing to Founding Architects

Thank you for your interest in contributing to the Ascendii Universe! This guide will help you get started.

## 🌟 Philosophy

> "This isn't a game. This is how systems serve souls." ∞

Every contribution should align with our core principles:
- **Beauty signals value** - Code should be elegant and purposeful
- **Effort earns recognition** - Quality contributions are celebrated
- **Systems serve souls** - Technology should enhance human flourishing

## 🚀 Getting Started

### 1. Fork the Repository

```bash
# Fork via GitHub UI, then clone your fork
git clone https://github.com/YOUR_USERNAME/founding-architects.git
cd founding-architects
git remote add upstream https://github.com/BryanSavage79/founding-architects.git
```

### 2. Set Up Development Environment

```bash
# Install dependencies
npm install

# Install Python dependencies (for simulations)
pip install numpy matplotlib

# Run tests
npx hardhat test
```

### 3. Create a Feature Branch

```bash
# Always branch from main
git checkout main
git pull upstream main
git checkout -b feature/your-feature-name
```

## 📝 Contribution Areas

### Smart Contracts
- New contract development
- Security improvements
- Gas optimization
- Integration with external protocols

### Economic Modeling
- Python simulations
- Parameter optimization
- Scenario testing
- Visualization improvements

### Documentation
- Technical guides
- API documentation
- Tutorial creation
- Translation

### Testing
- Unit tests
- Integration tests
- Security audits
- Gas benchmarking

## 💻 Code Standards

### Solidity

Follow the [Solidity Style Guide](https://docs.soliditylang.org/en/latest/style-guide.html):

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable2Step.sol";

/**
 * @title YourContract
 * @notice Brief description
 * @dev Detailed implementation notes
 */
contract YourContract is Ownable2Step {
    // State variables
    uint256 public constant MAX_SUPPLY = 1_000_000;
    
    // Events
    event SomethingHappened(address indexed user, uint256 amount);
    
    // Errors
    error InsufficientBalance();
    
    // Constructor
    constructor(address initialOwner) Ownable2Step(initialOwner) {
        // Initialize
    }
    
    // External functions
    function doSomething() external {
        // Implementation
    }
    
    // Internal functions
    function _helper() internal {
        // Implementation
    }
}
```

**Key Requirements:**
- Use Solidity 0.8.24+
- Include NatSpec comments
- Follow checks-effects-interactions pattern
- Use custom errors (not require strings)
- Prefer Ownable2Step over Ownable
- Use SafeERC20 for token transfers

### Python

Follow [PEP 8](https://peps.python.org/pep-0008/):

```python
import numpy as np
import matplotlib.pyplot as plt

class EconomicSimulation:
    """
    Economic simulation for Ascendii Universe mechanics.
    
    Attributes:
        num_users: Number of simulated users
        num_rounds: Number of simulation rounds
    """
    
    def __init__(self, num_users: int, num_rounds: int):
        self.num_users = num_users
        self.num_rounds = num_rounds
        
    def run_simulation(self) -> dict:
        """
        Run the economic simulation.
        
        Returns:
            Dictionary containing simulation results
        """
        # Implementation
        pass
```

**Key Requirements:**
- Type hints for function parameters
- Docstrings for classes and functions
- Descriptive variable names
- Visualization with clear labels

### JavaScript/TypeScript

```javascript
// Use async/await
async function deployContract() {
    const Contract = await ethers.getContractFactory("YourContract");
    const contract = await Contract.deploy(initialOwner);
    await contract.deployed();
    return contract;
}

// Use descriptive names
const effortTokenAddress = "0x...";
const sablierBatchAddress = "0x...";
```

## 📋 Commit Conventions

Use [Conventional Commits](https://www.conventionalcommits.org/):

```bash
# Format
<type>(<scope>): <description> ∞

# Types
feat:     New feature
fix:      Bug fix
docs:     Documentation changes
style:    Code style (formatting, no logic change)
refactor: Code refactoring
test:     Adding or updating tests
chore:    Maintenance tasks

# Examples
feat(contracts): Add EffortYieldStreamerV2 with pausable ∞
fix(simulation): Correct bonding curve price calculation ∞
docs(mechanics): Add probabilistic crafting formulas ∞
test(contracts): Add unit tests for tier transitions ∞
```

**Always end commits with ∞** - It's our signature.

## 🔄 Pull Request Process

### 1. Before Submitting

```bash
# Update your branch
git checkout main
git pull upstream main
git checkout feature/your-feature
git rebase main

# Run tests
npx hardhat test
python simulations/test_all.py

# Check code style
npx hardhat check
```

### 2. Create Pull Request

**Title Format:**
```
feat: Add [feature name] ∞
```

**Description Template:**
```markdown
## Description
Brief description of changes

## Motivation
Why is this change needed?

## Changes
- Change 1
- Change 2
- Change 3

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests pass
- [ ] Manual testing completed

## Checklist
- [ ] Code follows style guidelines
- [ ] Documentation updated
- [ ] Tests added/updated
- [ ] Commit messages follow conventions
- [ ] No merge conflicts

## Related Issues
Closes #123
```

### 3. Review Process

1. **Automated Checks**: CI/CD runs tests and linting
2. **Code Review**: Maintainers review code quality
3. **Discussion**: Address feedback and questions
4. **Approval**: At least one maintainer approval required
5. **Merge**: Squash and merge to main

## 🧪 Testing Requirements

### Smart Contracts

```javascript
describe("EffortYieldStreamer", function () {
    it("Should distribute yield to eligible users", async function () {
        // Setup
        await effortToken.mint(user1.address, ethers.utils.parseEther("10000"));
        
        // Execute
        await streamer.distributeWeeklyYield([user1.address]);
        
        // Assert
        expect(await streamer.streamCount(user1.address)).to.equal(1);
    });
});
```

**Coverage Requirements:**
- Minimum 80% code coverage
- Test happy paths and edge cases
- Test access control
- Test error conditions

### Economic Simulations

```python
def test_bonding_curve():
    """Test bonding curve price calculation."""
    sim = EconomicSimulation(num_users=100, num_rounds=20)
    results = sim.run_simulation()
    
    # Verify price increases with supply
    assert results['final_price'] > results['initial_price']
    
    # Verify reserve pool grows
    assert results['final_reserve'] > results['initial_reserve']
```

## 📚 Documentation Standards

### Code Comments

```solidity
/**
 * @notice Distributes monthly USDC yield to eligible users
 * @dev Uses Sablier V2 batch streaming for gas efficiency
 * @param recipients Array of user addresses to check for eligibility
 * @custom:security Only callable by authorized distributors
 */
function distributeWeeklyYield(address[] calldata recipients) external {
    // Implementation
}
```

### README Updates

When adding new features, update relevant README sections:
- Overview
- Quick Start
- API Reference
- Examples

### Mechanics Documentation

For new game mechanics, create a doc in `/docs/mechanics/`:

```markdown
# Mechanic Name

## Overview
Brief description

## Mathematical Model
Formulas and equations

## Smart Contract Implementation
Code snippets

## Economic Analysis
Cost/benefit analysis

## Integration Examples
How to use in practice
```

## 🔒 Security Guidelines

### Before Submitting

- [ ] No hardcoded private keys or secrets
- [ ] No infinite approvals (use exact amounts)
- [ ] Access control properly implemented
- [ ] Reentrancy guards where needed
- [ ] Integer overflow/underflow considered
- [ ] External calls follow checks-effects-interactions

### Reporting Vulnerabilities

**DO NOT** open public issues for security vulnerabilities.

Email: security@ascendii.universe (or DM maintainers)

Include:
- Description of vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

## 🎯 Priority Areas

We're actively seeking contributions in:

1. **Cross-Chain Integration**
   - LayerZero V2 implementation
   - Multi-chain deployment scripts
   - Bridge fee optimization

2. **Economic Modeling**
   - Advanced bonding curve models
   - Treasury sustainability analysis
   - Fee structure optimization

3. **Testing & Security**
   - Comprehensive test coverage
   - Gas optimization
   - Security audit preparation

4. **Documentation**
   - Tutorial creation
   - API documentation
   - Video guides

## 🤝 Community Guidelines

### Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on the code, not the person
- Help newcomers learn
- Celebrate contributions

### Communication Channels

- **GitHub Issues**: Bug reports, feature requests
- **GitHub Discussions**: General questions, ideas
- **Discord**: Real-time chat (coming soon)
- **Twitter**: Announcements (coming soon)

## 🏆 Recognition

Contributors are recognized in:
- README acknowledgments
- Release notes
- Community highlights
- Potential token airdrops (future)

## 📞 Questions?

- Open a [GitHub Discussion](https://github.com/BryanSavage79/founding-architects/discussions)
- Check existing [Issues](https://github.com/BryanSavage79/founding-architects/issues)
- Review [Documentation](/docs)

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

**"The forge awaits. Build with us." ∞**

Thank you for contributing to the Ascendii Universe!
