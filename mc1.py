import plotly.graph_objects as go
from plotly.subplots import make_subplots
import numpy as np



x_line = np.linspace(0, 10, 100)
y_line = np.sin(x_line)

fig = make_subplots(rows = 1, cols = 2, subplot_titles=('Line Plot'),horizontal_spacing=0.12)