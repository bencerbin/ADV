import numpy as np 
import pandas as pd

data = pd.Series([10, 20, np.nan, 40, np.nan, 60])

#df_clean = data.dropna()

data = data.fillna(data.mean())

print(data)

