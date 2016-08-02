# Middle Cedar optimization write-up


## 1) Input Data

The input data to the optimization is a series of tables capturing output from SWAT models. For each of the potential management options, we have a table containing the value to each potential objective for each HRU


Example table:

 HRU     Cost        N reduction     P reduction    Carbon
----   ------      -------------   -------------   -------
1       100         2.3             1.2               2.0
2       120         5.2             2.9               0.3
3       53          0.5             3.5               3.7

In this case, these parameters are relative values, measuring potential change from conventional agriculture (the assumed current land-use). So `cost` is the net loss of farm-level profit, and `N reduction` is the difference in nitrogen leaching between baseline and the alternative management. 

We can also include absolute (non-relative) values of any variable when that is more relevant to the desired analysis

Most of these data are on per hectare, so we also include area of each HRU.

## 2) Optimization

We have two ways of running the optimization: to generate a particular solution (like the least-cost way of hitting the reduction targets), or to generate a trade-off curve that shows the general reduction vs cost pattern. Both of these use the same programmatic back-end to take the SWAT data and the requirements for the solution and generate optimized results.

There are three main optimization problem formulations we use to do these analyses. Note that in all cases, there is a binary objective constraint that's used to model the discrete choice of which management. 

### Notation
* $\vec{x}$: a vector of 0 or 1 values that specify what management is assigned to each HRU. It consists of values $x_{hl}$ which specify if HRU $h$ is given management $l$. 

* $w_i$: a weight assigned to objective $i$. This value gives the importance of the objective in a given optimization run.

* $N$: the number of objectives in the optimization.

* $V_i$: the value matrix giving the values to service $i$ for each possible $x_{hl}$.

* $C$: the costs (opportunity and direct) of each possible $x_{hl}$.

* $L_{j}$: Loading of a pollutant $j$, either nitrogen, phosphorus, or sediment, under each possible $x_{hl}$.

### Weighted multi-objective formulation
In this case we maximize the weighted sum of different objective values. This formulation is used primarily to construct the frontiers, since it doesn't guarantee any particular values for the individual objectives. 

$$
\max_{\vec{x}} \sum_{i=1}^{N} w_i V_i \vec{x}
$$

### Least-cost target hitting
In this formulation, we set a constraint that a given solution must reduce N, P, or S loading by a certain amount $T$, and that the objective is to do so at the least cost.

$$
\begin{align}
\min_{\vec{x}} & C \vec{x} \\
\mathrm{s.t. }\ & L_{j} \vec{x} \lt T
\end{align}
$$

### Minimize loading for a given budget
In this formulation, we fix a maximum cost, $B$, and find the landscape that minimizes loading for N, P, or S:

$$
\begin{align}
\min_{\vec{x}} & L_{j} \vec{x} \\
\mathrm{s.t. }\ & C \vec{x} \lt B
\end{align}
$$


### Additional optional constraints
1. Excluded managment options. If desired, we can specify management options to ignore at the HRU level. 
2. Fixed managment options. We can lock in management for a given HRU. In our main analyses we locked in all non-crop HRUs from the baseline scenario, preventing change outside the current crop footprint
3. Target areas by management option. The model can accept min or max areas for each management type. This could be useful in case a certain habitat area (prairie or forest) is desired for conservation reasons.

Each of these additional constraints further specifies the analysis using one of the main methods. 






