import numpy as np
import matplotlib.pyplot as plt
from scipy.stats import norm

# Define core mechanics as functions

def accumulate_effort(users, activities_per_user, base_points=10):
    """Simulate effort point accumulation.
    Each user performs activities, earning points.
    Returns list of user efforts for threshold checks.
    """
    return np.random.normal(base_points, 2, users * activities_per_user)

def bonding_curve_price(supply, base_price=1, curve_factor=0.01):
    """Linear bonding curve for component pricing.
    Price increases with supply.
    """
    return base_price + curve_factor * supply

def purchase_components(effort_points, num_components, current_supply):
    """Users spend effort points on components via bonding curve.
    Returns cost, new supply.
    """
    costs = [bonding_curve_price(current_supply + i) for i in range(num_components)]
    total_cost = sum(costs)
    if total_cost > effort_points:
        return 0, current_supply  # Cannot afford
    return total_cost, current_supply + num_components

def probabilistic_mint(success_prob=0.5, effort=0, threshold=12, legendary_prob=0.05):
    """Probabilistic crafting with legendary check.
    Returns (mint_success, is_legendary).
    """
    mint = 1 if np.random.rand() < success_prob else 0
    if mint and effort > threshold and np.random.rand() < legendary_prob:
        return mint, 1
    return mint, 0

def redistribute_value(pool, fees=0.1):
    """Circulate value back to community pool.
    Add fees to pool for redistribution.
    """
    return pool * (1 + fees)

def sell_to_pool(num_sells, regular_sells, current_nft_supply, burn_rate=0.2):
    """Simulate selling NFTs to pool with burn (exempt legendaries).
    Returns burned NFTs, new supply after burn.
    """
    burned = int(regular_sells * burn_rate)
    new_supply = current_nft_supply - burned
    return burned, max(0, new_supply)  # Prevent negative supply

# Simulation parameters (customize for tests)
num_users = 100
activities_per_user = 5
initial_pool = 10000
initial_supply = 0
initial_nft_supply = 0
initial_legendary = 0
num_rounds = 10
success_prob = 0.5  # Can tie to effort/value
sell_fraction = 0.3  # Fraction of users selling per round
burn_rate = 0.2  # 20% burn on regular sells
effort_threshold = 12  # For legendary (above avg base=10)
legendary_prob = 0.05  # 5% chance if threshold met

# Run simulation
effort_history = []
supply_history = [initial_supply]
nft_supply_history = [initial_nft_supply]
legendary_history = [initial_legendary]
pool_history = [initial_pool]
mint_success = []
legendary_mints = []
burned_history = []

for round in range(num_rounds):
    user_efforts = accumulate_effort(num_users, activities_per_user)
    total_effort = np.sum(user_efforts)
    effort_history.append(total_effort)
    
    # Simulate purchases (per user effort)
    spent = 0
    current_supply = supply_history[-1]
    for ue in user_efforts:
        cost, new_supply = purchase_components(ue / activities_per_user, 1, current_supply)  # Avg per activity
        spent += cost
        current_supply = new_supply
    
    supply_history.append(current_supply)
    
    # Minting with legendary check
    successes = 0
    legendaries = 0
    for ue in user_efforts:
        mint, leg = probabilistic_mint(success_prob, ue / activities_per_user, effort_threshold, legendary_prob)
        successes += mint
        legendaries += leg
    mint_success.append(successes)
    legendary_mints.append(legendaries)
    current_nft_supply = nft_supply_history[-1] + successes
    current_legendary = legendary_history[-1] + legendaries
    
    # Selling to pool with burn exemption
    num_sells = int(num_users * sell_fraction)
    # Assume proportional sells (regular/legendary ratio)
    leg_ratio = current_legendary / current_nft_supply if current_nft_supply > 0 else 0
    leg_sells = int(num_sells * leg_ratio)
    reg_sells = num_sells - leg_sells
    burned, new_nft_supply = sell_to_pool(num_sells, reg_sells, current_nft_supply, burn_rate)
    burned_history.append(burned)
    new_legendary = current_legendary - leg_sells + leg_sells  # Exempt, recirculate
    nft_supply_history.append(new_nft_supply)
    legendary_history.append(new_legendary)
    
    # Redistribute (e.g., 10% of spent as fees to pool)
    fee_fraction = (spent * 0.1) / pool_history[-1] if pool_history[-1] > 0 else 0
    new_pool = redistribute_value(pool_history[-1], fees=fee_fraction)
    pool_history.append(new_pool)

# Output results (provable metrics)
print("Effort History per Round:", effort_history)
print("Component Supply History:", supply_history)
print("NFT Supply History:", nft_supply_history)
print("Legendary NFTs History:", legendary_history)
print("Successful Mints per Round:", mint_success)
print("Legendary Mints per Round:", legendary_mints)
print("Burned NFTs per Round:", burned_history)
print("Community Pool Growth:", pool_history)

# Visualization (save plot for tests)
plt.figure(figsize=(12, 10))
plt.subplot(3, 3, 1)
plt.plot(effort_history)
plt.title('Effort Accumulation')

plt.subplot(3, 3, 2)
plt.plot(supply_history)
plt.title('Component Supply')

plt.subplot(3, 3, 3)
plt.plot(mint_success)
plt.title('Successful Mints')

plt.subplot(3, 3, 4)
plt.plot(legendary_mints)
plt.title('Legendary Mints')

plt.subplot(3, 3, 5)
plt.plot(burned_history)
plt.title('Burned NFTs')

plt.subplot(3, 3, 6)
plt.plot(nft_supply_history)
plt.title('NFT Supply After Burn')

plt.subplot(3, 3, 7)
plt.plot(legendary_history)
plt.title('Legendary NFTs')

plt.subplot(3, 3, 8)
plt.plot(pool_history)
plt.title('Community Pool Growth')

plt.tight_layout()
plt.savefig('circulation_with_burn_exceptions_simulation.png')  # Use in repo/docs
plt.show()  # Or view in Jupyter
